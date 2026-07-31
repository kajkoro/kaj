# কাজকরো (KajKoro)

বাংলাদেশের তরুণদের জন্য ঘণ্টাভিত্তিক মাইক্রো-গিগ মার্কেটপ্লেস — জব পোস্ট করুন, বিড করে কাজ পান।

**স্ট্যাক:** Next.js 15 (App Router) + Supabase (Postgres/Auth) + Tailwind CSS 4 → Vercel-এ ডিপ্লয়।

---

## ১. লোকাল সেটআপ

```bash
npm install
cp .env.local.example .env.local   # নিচের ধাপ ২ থেকে ভ্যালু বসান
npm run dev
```

`http://localhost:3000` এ খুলবে।

---

## ২. Supabase প্রজেক্ট তৈরি

1. [supabase.com](https://supabase.com) এ গিয়ে ফ্রি একটা প্রজেক্ট তৈরি করুন
2. **Project Settings → API** থেকে `Project URL` এবং `anon public` key কপি করে `.env.local`-এ বসান
3. **SQL Editor** এ গিয়ে `supabase/schema.sql` ফাইলের পুরো কনটেন্ট পেস্ট করে Run করুন — এটা সব টেবিল, RLS পলিসি, এবং প্রি-লোডেড কাজের ক্যাটাগরি (কিচেন পরিষ্কার, রান্না, টিউশন ইত্যাদি) তৈরি করে দেবে
4. **Authentication → Providers** এ Email প্রোভাইডার এনাবল আছে কিনা কনফার্ম করুন (ডিফল্টে থাকে)
5. **Authentication → URL Configuration** এ আপনার Vercel ডোমেইন (ডিপ্লয় করার পর) যোগ করুন Redirect URLs-এ

---

## ৩. GitHub → Vercel ডিপ্লয়

আপনার আগের ওয়ার্কফ্লো অনুযায়ী:

```bash
git init
git add .
git commit -m "Initial commit: KajKoro marketplace MVP"
git remote add origin https://github.com/<your-username>/kajkoro.git
git push -u origin main
```

তারপর Vercel-এ:
1. New Project → GitHub রিপো import করুন
2. **Environment Variables** এ `NEXT_PUBLIC_SUPABASE_URL` ও `NEXT_PUBLIC_SUPABASE_ANON_KEY` যোগ করুন (একই ভ্যালু যা `.env.local`-এ আছে)
3. Deploy চাপুন

---

## ৪. এই MVP-তে যা আছে

- ✅ সাইনআপ/লগইন (Supabase Auth)
- ✅ প্রোফাইল সেটআপ — বায়ার/ওয়ার্কার রোল, এলাকা, ঘণ্টা-রেট, সর্বোচ্চ ৫টি স্কিল সিলেকশন
- ✅ জব পোস্ট করা (এলাকা, ঘণ্টা, প্রস্তাবিত রেট, তারিখ/সময়সহ)
- ✅ এলাকা-ফিল্টার সহ জব ব্রাউজিং
- ✅ ওয়ার্কার প্রোফাইল ব্রাউজিং
- ✅ বিডিং সিস্টেম (ওয়ার্কার রেট দিয়ে বিড করে)
- ✅ বিড অ্যাক্সেপ্ট করে ওয়ার্কার নিয়োগ
- ✅ রেটিং/রিভিউ ডেটা মডেল (schema তৈরি, UI এখনো বাকি)
- ✅ Row Level Security — প্রতিটি টেবিলে ডেটা আইসোলেশন

## ৫. যা এখনো করতে হবে (গুরুত্ব অনুযায়ী সাজানো)

এইগুলো নিয়ে পরবর্তী সেশনে কাজ করতে পারি:

1. **NID ভেরিফিকেশন ইন্টিগ্রেশন** — এই মুহূর্তে `nid_verified` ফিল্ড শুধু ডেটাবেসে আছে, কোনো actual verification flow নেই। একটা third-party KYC provider (face-match + NID OCR) দরকার হবে। **গুরুত্বপূর্ণ:** NID নম্বর plaintext সংরক্ষণ করবেন না — production এ pgcrypto দিয়ে এনক্রিপ্ট করুন অথবা শুধু verification status রাখুন, raw NID নয়।
2. **পেমেন্ট গেটওয়ে** (SSLCommerz/bKash Merchant API) — এখন পেমেন্ট শুধু `transactions` টেবিলে রেকর্ড হয়, actual gateway call নেই
3. **রেটিং/রিভিউ UI** — schema আছে (ট্রিগারসহ rating average auto-update হয়), কিন্তু ফর্ম/ডিসপ্লে বাকি
4. **রিয়েলটাইম বিড নোটিফিকেশন** — Supabase Realtime subscription যোগ করে বায়ারকে লাইভ বিড দেখানো যাবে
5. **ইমেইল/SMS নোটিফিকেশন** (বিড এলে, অ্যাক্সেপ্ট হলে)
6. **ইমার্জেন্সি কন্টাক্ট + ইন-অ্যাপ চেক-ইন** UI (schema তে ফিল্ড আছে)
7. **অ্যাডমিন প্যানেল** — ইউজার সাসপেন্ড করা, ডিসপিউট হ্যান্ডেল করা

## ৬. প্রজেক্ট স্ট্রাকচার

```
app/
  page.tsx              → ল্যান্ডিং পেজ
  jobs/page.tsx          → জব ব্রাউজ (এলাকা ফিল্টার)
  jobs/new/page.tsx       → জব পোস্ট ফর্ম
  jobs/[id]/page.tsx      → জব ডিটেইল + বিডিং
  workers/page.tsx        → ওয়ার্কার ব্রাউজ
  profile/page.tsx        → প্রোফাইল সেটআপ (worker/buyer)
  login/, signup/         → অথেন্টিকেশন
components/               → JobCard, WorkerCard, BidForm, AcceptBidButton, Navbar
lib/supabase/             → browser + server Supabase ক্লায়েন্ট
lib/types.ts               → শেয়ার্ড TypeScript টাইপ + এলাকার লিস্ট
supabase/schema.sql         → সম্পূর্ণ ডেটাবেস স্কিমা + RLS পলিসি
```

## ৭. ডিজাইন সিস্টেম

রিকশা-আর্ট অনুপ্রাণিত প্যালেট (কোবাল্ট ব্লু + মেরিগোল্ড + ভার্মিলিয়ন), Hind Siliguri (হেডলাইন) + Noto Sans Bengali (বডি) + Space Grotesk (নাম্বার/UI) ফন্ট পেয়ারিং। জব কার্ডগুলো "টিকিট স্টাব" স্টাইলে ডিজাইন করা — কালার/ফন্ট টোকেন `app/globals.css`-এ `:root` ভ্যারিয়েবল হিসেবে আছে, বদলাতে চাইলে ওখানেই বদলান।
