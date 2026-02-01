# 📋 تقرير شامل - النصوص الإنجليزية في صفحات Client

## ملخص الفحص
تم فحص جميع صفحات الـ Client ووجدنا النصوص الإنجليزية التالية التي تحتاج ترجمة:

---

## 1️⃣ صفحة طرق الدفع (Payment Methods)
**المسار:** `/dashboard/client/payment-methods`
**الملف:** `src/sections/client/payment/payment-methods.tsx`

### النصوص الإنجليزية:
- ❌ "Payment Methods" (العنوان)
- ❌ "Loading payment methods..."
- ❌ "Failed to load payment methods"
- ❌ "Retry"
- ❌ "Add New Card"
- ❌ "No payment methods"
- ❌ "You haven't added any payment methods yet. Add your first card to get started."
- ❌ "Add Payment Method"
- ❌ "Expires" (تنتهي الصلاحية)
- ❌ "Delete payment method" (Tooltip)
- ❌ "Delete Payment Method" (Dialog title)
- ❌ "Are you sure you want to delete this payment method? This action cannot be undone."
- ❌ "Delete" (زر)
- ❌ أسماء أنواع البطاقات: "Visa", "Mastercard", "American Express", "Bank Transfer", "PayPal"

---

## 2️⃣ نافذة إضافة بطاقة جديدة
**الملف:** `src/sections/client/payment/payment-new-card-dialog.tsx`

### النصوص الإنجليزية:
- ❌ "Add New Payment Method" (عنوان النافذة)
- ❌ "Card Type"
- ❌ "Cardholder Name"
- ❌ "John Doe" (placeholder)
- ❌ "Card Number"
- ❌ "1234 5678 9012 3456" (placeholder)
- ❌ "Expiry Date"
- ❌ "MM/YY" (placeholder)
- ❌ "CVC"
- ❌ "123" (placeholder)
- ❌ "3 or 4 digit security code on the back of your card" (Tooltip)
- ❌ "Your payment information is secure and encrypted"
- ❌ "Cancel"
- ❌ "Add Card"
- ❌ رسائل الأخطاء:
  - "Cardholder name is required"
  - "Please enter a valid card number"
  - "Please enter a valid expiry date (MM/YY)"
  - "Please enter a valid CVC"
  - "Failed to add payment method. Please try again."

---

## 3️⃣ صفحة السلة (Shopping Cart)
**المسار:** `/dashboard/product/cart`
**الملف:** `src/sections/product/view/product-cart-view.tsx`

### النصوص الإنجليزية:
- ❌ "Shopping Cart"
- (يحتاج فحص كامل للملف)

---

## 4️⃣ صفحة المتجر (Shop)
**المسار:** `/dashboard/product/shop`
**الملف:** `src/sections/product/view/product-shop-view.tsx`

(يحتاج فحص)

---

## ✅ الصفحات المعربة بالفعل:

1. ✅ **لوحة تحكم العميل** - `/dashboard`
   - `client-order-stats.tsx`
   - `client-total-spent.tsx`
   - `client-cart-summary.tsx`
   - `client-quick-actions.tsx`
   - `client-recent-orders.tsx`
   - `overview-client-view.tsx`

2. ✅ **تفاصيل المنتج** - `/dashboard/product/:id`
   - `product-details-view.tsx`

---

## 📊 الإحصائيات:

- **صفحات معربة:** 2 صفحة رئيسية (Dashboard + Product Details)
- **صفحات تحتاج تعريب:** 3+ صفحات (Payment Methods, Cart, Shop)
- **عدد النصوص المتبقية:** ~40+ نص

---

## 🎯 الأولويات المقترحة:

### أولوية عالية:
1. **Payment Methods** - صفحة مهمة للعميل
2. **Shopping Cart** - صفحة أساسية

### أولوية متوسطة:
3. **Product Shop** - صفحة التصفح

---

## 💡 ملاحظات:

1. بعض الترجمات موجودة بالفعل في ملف `ar/common.json` تحت `investor.payment` لكن تحتاج نسخها لـ `client.payment`
2. أسماء البطاقات (Visa, Mastercard, etc.) يمكن تركها بالإنجليزية أو ترجمتها حسب الرغبة
3. يُفضل توحيد الترجمات بين Client و Investor لتجنب التكرار

---

## 🚀 الخطوات التالية:

هل تريد أن أبدأ بتعريب:
1. صفحة طرق الدفع (Payment Methods) ونافذة إضافة البطاقة؟
2. صفحة السلة (Shopping Cart)؟
3. صفحة المتجر (Shop)؟
4. الكل؟

أخبرني وسأبدأ فوراً! 💪
