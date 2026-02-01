# تحديثات الترجمة - لوحة تحكم العميل

## التغييرات المنفذة

تم إصلاح مشكلة اللغة في صفحة نظرة عامة على لوحة تحكم العميل (`/dashboard`) حيث كانت بعض النصوص تظهر بالإنجليزية بدلاً من العربية.

### الملفات المعدلة:

#### 1. ملف الترجمة العربي
**الملف:** `src/locales/langs/ar/common.json`

تم إضافة الترجمات التالية تحت `client.dashboard`:

```json
{
  "orderStats": {
    "totalOrders": "إجمالي الطلبات",
    "pending": "قيد الانتظار",
    "completed": "مكتملة"
  },
  "totalSpent": {
    "title": "إجمالي المبلغ المنفق",
    "subtitle": "جميع الطلبات المكتملة"
  },
  "cartSummary": {
    "itemsInCart": "منتجات في السلة",
    "viewCart": "عرض السلة"
  },
  "quickActions": {
    "paymentMethods": "طرق الدفع",
    "manageCards": "إدارة البطاقات"
  },
  "recentOrders": {
    "title": "الطلبات الأخيرة",
    "viewAll": "عرض الكل",
    "orderId": "رقم الطلب",
    "date": "التاريخ",
    "items": "المنتجات",
    "total": "الإجمالي",
    "status": "الحالة",
    "actions": "الإجراءات",
    "loadingOrders": "جاري تحميل الطلبات...",
    "noOrders": "لا توجد طلبات بعد",
    "noOrdersDescription": "ابدأ التسوق لرؤية طلباتك هنا",
    "browseProducts": "تصفح المنتجات",
    "viewDetails": "عرض التفاصيل"
  }
}
```

#### 2. مكونات React المعدلة

تم تحديث المكونات التالية لاستخدام نظام الترجمة:

1. **`src/sections/client/overview/client-order-stats.tsx`**
   - استبدال "Total Orders" بـ `t('client.dashboard.orderStats.totalOrders')`
   - استبدال "Pending" بـ `t('client.dashboard.orderStats.pending')`
   - استبدال "Completed" بـ `t('client.dashboard.orderStats.completed')`

2. **`src/sections/client/overview/client-total-spent.tsx`**
   - استبدال "Total Spent" بـ `t('client.dashboard.totalSpent.title')`
   - استبدال "All completed orders" بـ `t('client.dashboard.totalSpent.subtitle')`

3. **`src/sections/client/overview/client-cart-summary.tsx`**
   - استبدال "Items in Cart" بـ `t('client.dashboard.cartSummary.itemsInCart')`
   - استبدال "View Cart" بـ `t('client.dashboard.cartSummary.viewCart')`

4. **`src/sections/client/overview/client-quick-actions.tsx`**
   - استبدال "Payment Methods" بـ `t('client.dashboard.quickActions.paymentMethods')`
   - استبدال "Manage Cards" بـ `t('client.dashboard.quickActions.manageCards')`

5. **`src/sections/client/overview/client-recent-orders.tsx`**
   - استبدال جميع النصوص في جدول الطلبات الأخيرة
   - استبدال عناوين الأعمدة والرسائل

### النتيجة

الآن جميع النصوص في صفحة لوحة تحكم العميل تظهر باللغة العربية بشكل صحيح، بما في ذلك:

- ✅ إجمالي الطلبات
- ✅ قيد الانتظار / مكتملة
- ✅ إجمالي المبلغ المنفق
- ✅ منتجات في السلة
- ✅ طرق الدفع
- ✅ الطلبات الأخيرة (مع جميع عناوين الجدول)

### كيفية إضافة ترجمات جديدة في المستقبل

1. أضف الترجمة في `src/locales/langs/ar/common.json`
2. استخدم `useTranslate` hook في المكون:
   ```tsx
   import { useTranslate } from 'src/locales';
   
   export function MyComponent() {
     const { t } = useTranslate();
     
     return <div>{t('path.to.translation')}</div>;
   }
   ```

### ملاحظات

- تم الحفاظ على البنية الحالية للكود
- لم يتم تغيير أي منطق برمجي
- فقط تم استبدال النصوص الثابتة بنظام الترجمة
