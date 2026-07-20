# ShareLove Letters — Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the SQL Editor, run the contents of `supabase/schema.sql`
3. Copy your project URL and keys from **Settings → API**

## 3. Set up Resend (for email delivery)

1. Go to [resend.com](https://resend.com) and create a free account
2. Create an API key
3. Add and verify your sending domain (or use their sandbox for testing)

## 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 6. Deploy to Vercel

```bash
npx vercel
```

Add all env vars in the Vercel dashboard under **Settings → Environment Variables**.
Update `NEXT_PUBLIC_APP_URL` to your production URL.

---

## Google AdSense (when ready)

Add this to `app/layout.tsx` `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
```

Then place `<ins class="adsbygoogle">` ad units in your pages.
