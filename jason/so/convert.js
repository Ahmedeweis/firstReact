const postmanToOpenapi = require('postman-to-openapi');
const path = require('path');
const fs = require('fs');
async function convert() {
    try {
        const inputPath = path.join(__dirname, 'postman_collection.json');
        const outputPath = path.join(__dirname, 'swagger.yaml');
        // 1. قراءة ملف البوستمان يدوياً أولاً
        const rawData = fs.readFileSync(inputPath, 'utf8');
        let collectionData = JSON.parse(rawData);
        // 2. التحقق مما إذا كان الملف مغلفاً بكلمة "collection"
        // هذا هو الجزء الذي سيحل مشكلة الـ TypeError
        if (collectionData.collection) {
            console.log('📦 Detected nested collection, unwrapping...');
            collectionData = collectionData.collection;
        }
        const options = {
            defaultTag: 'General',
            servers: [
                {
                    url: 'http://localhost:5000',
                    description: 'Local Server'
                }
            ]
        };
        // 3. بعض إصدارات المكتبة تتوقع JSON string بدلاً من كائن مباشر
        const inputForConverter = typeof collectionData === 'string' ? collectionData : JSON.stringify(collectionData);
        let result;
        try {
            result = await postmanToOpenapi(inputForConverter, outputPath, options);
        } catch (e) {
            // some versions throw when given 3 args — try 2 args
            result = await postmanToOpenapi(inputForConverter, options);
        }

        // The library may return the YAML string instead of writing a file.
        if (typeof result === 'string') {
            fs.writeFileSync(outputPath, result, 'utf8');
            console.log(`✅ تم التحويل بنجاح! الملف مكتوب إلى ${outputPath}`);
        } else if (fs.existsSync(outputPath)) {
            console.log(`✅ تم التحويل بنجاح! الملف موجود: ${outputPath}`);
        } else {
            // Fallback: run the CLI via npx and capture stdout to file
            const { execSync } = require('child_process');
            try {
                console.log('↪ تنفيذ fallback عبر npx لتوليد swagger.yaml (streaming)...');
                const { spawn } = require('child_process');
                const outStream = fs.createWriteStream(outputPath);
                const proc = spawn('npx', ['postman-to-openapi', './postman_collection.json', '-f', './swagger.yaml'], { shell: true });
                proc.stdout.pipe(outStream);
                proc.stderr.on('data', (d) => {
                    // log stderr data if needed
                    process.stderr.write(d.toString());
                });
                const exitCode = await new Promise((resolve) => proc.on('close', resolve));
                outStream.close();
                if (exitCode === 0 && fs.existsSync(outputPath)) {
                    console.log(`✅ Fallback succeeded — swagger written to ${outputPath}`);
                } else {
                    console.error('❌ فشل إنشاء swagger.yaml عبر npx (exit ' + exitCode + ')');
                }
            } catch (cliErr) {
                console.error('❌ فشل الـ fallback CLI:', cliErr && cliErr.message ? cliErr.message : cliErr);
            }
        }
    } catch (err) {
        console.error('❌ حدث خطأ أثناء التحويل:', err.message);
    }
}
convert();