# دليل دعم اللغات (i18n Guide)

## نظرة عامة

تم تفعيل نظام الترجمة (i18n) في المشروع لدعم اللغتين العربية والإنجليزية باستخدام `i18next` و `react-i18next`.

## البنية الأساسية

### ملفات الترجمة

- `locales/ar.json` - الترجمات العربية
- `locales/en.json` - الترجمات الإنجليزية

### ملف الإعدادات

- `i18n.ts` - ملف إعدادات i18next

### المكونات

- `components/ui/LanguageToggle.tsx` - مكون تبديل اللغة

## كيفية الاستخدام

### في المكونات

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('common.appTagline')}</p>
    </div>
  );
};
```

### إضافة نص جديد

1. أضف المفتاح إلى `locales/ar.json`:
```json
{
  "mySection": {
    "myKey": "النص بالعربية"
  }
}
```

2. أضف الترجمة الإنجليزية إلى `locales/en.json`:
```json
{
  "mySection": {
    "myKey": "English text"
  }
}
```

3. استخدمه في المكون:
```tsx
{t('mySection.myKey')}
```

## الميزات

- ✅ تبديل اللغة ديناميكياً
- ✅ حفظ اختيار اللغة في localStorage
- ✅ اكتشاف اللغة تلقائياً من المتصفح
- ✅ دعم RTL/LTR تلقائياً
- ✅ تحديث اتجاه الصفحة عند تغيير اللغة

## المواقع المحدثة

- ✅ `LandingPage` - الصفحة الرئيسية
- ✅ `LoginPage` - صفحة تسجيل الدخول
- ✅ `App.tsx` - مكون التحميل
- ✅ `LanguageToggle` - مكون تبديل اللغة

## الملفات المطلوب تحديثها لاحقاً

- `RegisterPage` - صفحة التسجيل
- `Dashboard` - لوحة التحكم
- `DashboardOverview` - نظرة عامة
- باقي المكونات حسب الحاجة

## ملاحظات

- اللغة الافتراضية: العربية
- يتم حفظ اللغة المختارة في localStorage تلقائياً
- اتجاه الصفحة (RTL/LTR) يتم تحديثه تلقائياً عند تغيير اللغة

