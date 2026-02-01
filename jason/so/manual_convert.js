const fs = require('fs');
const jsyaml = require('js-yaml');

const postmanPath = './postmancollection.json';
const outputPath = './swagger.yaml';

try {
    let postmanData = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));

    // Handle wrapper if present
    if (postmanData.collection) {
        console.log('Found wrapper object "collection", unwrapping...');
        postmanData = postmanData.collection;
    }

    const openApi = {
        openapi: '3.0.0',
        info: {
            title: (postmanData.info && postmanData.info.name) ? postmanData.info.name : 'API Documentation',
            description: (postmanData.info && postmanData.info.description) ? postmanData.info.description : '',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'https://smart-field-evaluation-system.smartleadtech.com',
                description: 'Base URL'
            }
        ],
        paths: {},
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    };

    function processItems(items, parentTag) {
        if (!items) return;
        items.forEach(item => {
            if (item.item) {
                // It's a folder, recurse
                // Use the folder name as the tag. 
                processItems(item.item, item.name);
            } else if (item.request) {
                // It's a request
                processRequest(item, parentTag);
            }
        });
    }

    function processRequest(item, tag) {
        const req = item.request;
        let method = req.method ? req.method.toLowerCase() : 'get';

        // Extract URL
        let urlPath = '';
        if (req.url) {
            if (typeof req.url === 'string') {
                urlPath = req.url;
            } else if (req.url.path) {
                // path is array
                if (Array.isArray(req.url.path)) {
                    urlPath = '/' + req.url.path.join('/');
                } else {
                    urlPath = req.url.path;
                }
            } else if (req.url.raw) {
                // Try to parse raw if path is missing
                try {
                    // Check if it starts with http/https
                    if (req.url.raw.match(/^https?:\/\//)) {
                        const u = new URL(req.url.raw);
                        urlPath = u.pathname;
                    } else {
                        // Likely {{base_url}}/some/path
                        let parts = req.url.raw.split('/');
                        if (parts.length > 1) {
                            parts.shift(); // remove host/var
                            urlPath = '/' + parts.join('/');
                        } else {
                            urlPath = req.url.raw;
                        }
                    }
                } catch (e) {
                    urlPath = req.url.raw;
                }
            }
        }

        // Normalize Path
        if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

        // Clean path variables (Postman :id -> OpenAPI {id})
        urlPath = urlPath.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

        // Initialize path in openApi
        if (!openApi.paths[urlPath]) {
            openApi.paths[urlPath] = {};
        }

        const operation = {
            summary: item.name,
            tags: tag ? [tag] : ['General'],
            responses: {
                '200': {
                    description: 'Successful response'
                }
            }
        };

        // Headers
        if (req.header && Array.isArray(req.header)) {
            req.header.forEach(h => {
                if (h.key === 'Authorization') {
                    operation.security = [{ bearerAuth: [] }];
                }
            });
        }

        // Body
        if (req.body && ['post', 'put', 'patch'].includes(method)) {
            let contentType = 'application/json';
            // Check headers for content type
            if (req.header) {
                const ct = req.header.find(h => h.key && h.key.toLowerCase() === 'content-type');
                if (ct) contentType = ct.value;
            }

            if (req.body.mode === 'raw') {
                operation.requestBody = {
                    content: {
                        [contentType]: {
                            schema: {
                                type: 'object',
                                example: safeJsonParse(req.body.raw)
                            }
                        }
                    }
                };
            } else if (req.body.mode === 'formdata') {
                operation.requestBody = {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {}
                            }
                        }
                    }
                };
                if (req.body.formdata) {
                    req.body.formdata.forEach(field => {
                        operation.requestBody.content['multipart/form-data'].schema.properties[field.key] = {
                            type: 'string',
                            default: field.value
                        };
                    });
                }
            } else if (req.body.mode === 'urlencoded') {
                operation.requestBody = {
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {}
                            }
                        }
                    }
                };
                if (req.body.urlencoded) {
                    req.body.urlencoded.forEach(field => {
                        operation.requestBody.content['application/x-www-form-urlencoded'].schema.properties[field.key] = {
                            type: 'string',
                            default: field.value
                        };
                    });
                }
            }
        }

        openApi.paths[urlPath][method] = operation;
    }

    function safeJsonParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }

    if (postmanData.item) {
        processItems(postmanData.item);
    } else {
        console.warn('No items found in collection');
    }

    const yamlStr = jsyaml.dump(openApi);
    fs.writeFileSync(outputPath, yamlStr, 'utf8');
    console.log('Successfully converted to swagger.yaml');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
