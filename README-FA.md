# وب‌سایت ElAi — آماده برای GitHub و Vercel

## روش آپلود
1. وارد ریپازیتوری فعلی GitHub شوید.
2. از **Add file → Upload files** استفاده کنید.
3. **محتویات پوشه** را در ریشه ریپازیتوری قرار دهید؛ فایل‌های `api/consult.js` و `api/lead.js` باید داخل پوشه `api` بمانند.
4. پیام کامیت پیشنهادی: `Update ElAi website: mobile performance, Telegram and Bale bot services`
5. در صورت اتصال ریپازیتوری به پروژه فعلی Vercel، انتشار خودکار انجام می‌شود.

## نکات ضروری
- تصویر `elai-avatar.webp` کنار `index.html` قرار بگیرد.
- کلیدهای واقعی API را در GitHub آپلود نکنید.
- در Vercel بخش Environment Variables مقادیر `OPENAI_API_KEY` و `OPENAI_MODEL` را برای مشاور و `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` را برای فرم پروژه تنظیم کنید.
- برای ثبت درخواست پروژه، فایل `supabase-schema.sql` باید در Supabase اجرا شود.
- اگر متغیرهای محیطی تنظیم نشده باشند، سایت نمایش داده می‌شود اما مشاور هوشمند یا ثبت درخواست ممکن است کار نکند.

## محتوا
- خدمات ساخت ربات تلگرام و بله، n8n، AI، داده و وب
- صفحه اصلی دو زبانه و بهینه‌شده برای موبایل
- دو صفحه نمونه‌کار با لینک GitHub
- APIهای مشاور و فرم پروژه
