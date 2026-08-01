import { createClient } from "@/lib/supabase/server";

// ---------- Default content (used until an admin overrides it) ----------
export const DEFAULT_CONTENT: Record<string, string> = {
  home_hero_subtitle:
    "সাদিয়ার বাসার কিচেন পরিষ্কার দরকার, দুই ঘণ্টার জন্য। আফরিন ধানমন্ডিতেই থাকে, ভার্সিটিতে পড়ে, সময় বের করতে পারে। কাজকরো দুজনকে মেলায় — নিরাপদে, স্বচ্ছভাবে।",
  home_who_for_text:
    "যারা ভার্সিটিতে পড়ছেন, টিউশনি পাচ্ছেন না, চাকরি খুঁজছেন কিন্তু এখনো পাননি, অথবা মাসের মাঝামাঝি হাতখরচ শেষ হয়ে যায় — নিজের সময়মতো, নিজের এলাকায়, ছোট ছোট কাজ করে সৎভাবে আয় করার একটা জায়গা। কাজকে ছোট করে দেখার সংস্কৃতি বদলাতে চাই আমরা — একটা পরিষ্কার বাথরুম, একটা গোছানো কিচেন, একজনের হাতে-বানানো রান্না — এগুলো সম্মানের কাজ, লজ্জার না।",
  home_safety_text:
    "একটা অচেনা মানুষকে বাসায় ঢুকতে দেওয়া বা অচেনা বাসায় কাজ করতে যাওয়া — দুটোই ভরসার ব্যাপার। তাই আমরা শুধু ম্যাচমেকিং না, নিরাপত্তার অবকাঠামো তৈরিতেও বিনিয়োগ করছি।",

  privacy_body: `কাজকরো (আমরা) ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষাকে গুরুত্বসহকারে দেখে। এই পেজে বলা হয়েছে আমরা কী তথ্য সংগ্রহ করি, কেন করি, এবং কীভাবে সুরক্ষিত রাখি।

## আমরা যে তথ্য সংগ্রহ করি
- নাম, ফোন নম্বর, ইমেইল — অ্যাকাউন্ট তৈরির সময়
- এলাকা/ঠিকানার তথ্য — কাছাকাছি কাজ/কর্মী মেলানোর জন্য
- NID ভেরিফিকেশন তথ্য — পরিচয় নিশ্চিত করার জন্য
- জব পোস্ট, বিড, রেটিং ও রিভিউয়ের তথ্য
- পেমেন্ট লেনদেনের রেকর্ড (কার্ড নম্বর আমরা সংরক্ষণ করি না)

## তথ্য কীভাবে ব্যবহার করি
সংগ্রহ করা তথ্য শুধুমাত্র প্ল্যাটফর্মের মূল কাজ পরিচালনার জন্য ব্যবহার করা হয়। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।

## তথ্য সুরক্ষা
আপনার ডেটা এনক্রিপ্টেড সংযোগে সংরক্ষণ ও স্থানান্তর করা হয়।

## আপনার অধিকার
আপনি যেকোনো সময় আপনার প্রোফাইল তথ্য দেখতে, সংশোধন করতে, বা অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারেন। যোগাযোগ পেজ থেকে আমাদের জানান।`,

  terms_body: `কাজকরো ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন।

## ১. প্ল্যাটফর্মের ভূমিকা
কাজকরো একটি মধ্যস্থতাকারী মার্কেটপ্লেস। ওয়ার্কাররা কাজকরো-র কর্মচারী নন, তারা স্বাধীন কন্ট্রাক্টর হিসেবে কাজ করেন।

## ২. অ্যাকাউন্ট ও যোগ্যতা
অ্যাকাউন্ট তৈরি করতে হলে আপনার বয়স ১৮ বছর বা তার বেশি হতে হবে এবং প্রদত্ত তথ্য সঠিক হতে হবে।

## ৩. বিডিং ও নিয়োগ
জব পোস্ট করার পর ওয়ার্কাররা বিড করতে পারবেন। বায়ার যেকোনো বিড গ্রহণ বা প্রত্যাখ্যান করার সম্পূর্ণ স্বাধীনতা রাখেন।

## ৪. পেমেন্ট ও কমিশন
প্রতিটি সম্পন্ন কাজের উপর কাজকরো একটি নির্দিষ্ট শতাংশ কমিশন গ্রহণ করে।

## ৫. আচরণবিধি
- ভুয়া প্রোফাইল বা রিভিউ নিষিদ্ধ
- অসম্মানজনক বা হুমকিমূলক আচরণ নিষিদ্ধ
- প্ল্যাটফর্ম বাইপাস করে সরাসরি লেনদেন থেকে বিরত থাকার অনুরোধ করা হচ্ছে

## ৬. দায়বদ্ধতার সীমাবদ্ধতা
কাজের মান বা ফলাফল সম্পর্কে কাজকরো সরাসরি নিশ্চয়তা দেয় না।

## ৭. পরিবর্তন
এই শর্তাবলী সময়ে সময়ে পরিবর্তিত হতে পারে।`,

  disclaimer_body: `## মধ্যস্থতাকারী প্ল্যাটফর্ম
কাজকরো শুধুমাত্র একটি সংযোগকারী মার্কেটপ্লেস। কাজকরো নিজে কোনো ওয়ার্কারকে নিয়োগ দেয় না এবং কোনো বায়ারের পক্ষেও কাজ করে না।

## কাজের মান ও নিরাপত্তা
আমরা NID ভেরিফিকেশন ও রেটিং সিস্টেমের মাধ্যমে বিশ্বাসযোগ্যতা বাড়ানোর চেষ্টা করি, কিন্তু কোনো ওয়ার্কার বা বায়ারের আচরণের সম্পূর্ণ নিশ্চয়তা কাজকরো দিতে পারে না।

## আর্থিক লেনদেন
বায়ার ও ওয়ার্কারের মধ্যে সম্মত রেট ও পেমেন্ট পদ্ধতি তাদের নিজস্ব সিদ্ধান্ত।

## জরুরি অবস্থা
কোনো নিরাপত্তা ঝুঁকি বা জরুরি পরিস্থিতিতে সাথে সাথে স্থানীয় জরুরি সেবা (৯৯৯) এ যোগাযোগ করুন।`,

  support_intro: "সচরাচর জিজ্ঞাসিত প্রশ্ন। নিচে উত্তর না পেলে সরাসরি যোগাযোগ করুন।",
  contact_intro: "প্রশ্ন, অভিযোগ, বা পরামর্শ — যেকোনো কিছু জানাতে নিচের ফর্ম পূরণ করুন।",
};

export const CONTENT_LABELS: Record<string, string> = {
  home_hero_subtitle: "হোমপেজ — হিরো সাবটাইটেল",
  home_who_for_text: "হোমপেজ — 'যাদের জন্য কাজকরো' অনুচ্ছেদ",
  home_safety_text: "হোমপেজ — নিরাপত্তা অনুচ্ছেদ",
  privacy_body: "প্রাইভেসি পলিসি — মূল কনটেন্ট",
  terms_body: "টার্মস অ্যান্ড কন্ডিশন — মূল কনটেন্ট",
  disclaimer_body: "ডিসক্লেইমার — মূল কনটেন্ট",
  support_intro: "সাপোর্ট পেজ — ভূমিকা",
  contact_intro: "যোগাযোগ পেজ — ভূমিকা",
};

export const DEFAULT_SEO: Record<string, { title: string; description: string }> = {
  home: { title: "কাজকরো | ছোট কাজ, বড় ভরসা", description: "ঢাকার ঘণ্টাভিত্তিক কাজের মার্কেটপ্লেস — জব পোস্ট করুন বা কাজ খুঁজে আয় করুন।" },
  jobs: { title: "কাজ খুঁজুন | কাজকরো", description: "আপনার এলাকায় খোলা কাজগুলো দেখুন এবং বিড করুন।" },
  workers: { title: "কর্মী খুঁজুন | কাজকরো", description: "যাচাইকৃত কর্মীদের প্রোফাইল দেখুন, রেটিং ও রেট অনুযায়ী বেছে নিন।" },
  privacy: { title: "প্রাইভেসি পলিসি | কাজকরো", description: "কাজকরো কীভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করে।" },
  terms: { title: "টার্মস অ্যান্ড কন্ডিশন | কাজকরো", description: "কাজকরো ব্যবহারের শর্তাবলী।" },
  disclaimer: { title: "ডিসক্লেইমার | কাজকরো", description: "কাজকরো একটি মধ্যস্থতাকারী প্ল্যাটফর্ম — সীমাবদ্ধতা ও দায়বদ্ধতা সম্পর্কিত তথ্য।" },
  support: { title: "সাপোর্ট | কাজকরো", description: "সচরাচর জিজ্ঞাসিত প্রশ্ন ও সহায়তা।" },
  contact: { title: "যোগাযোগ | কাজকরো", description: "কাজকরো টিমের সাথে যোগাযোগ করুন।" },
};

// ---------- Fetch helpers (server-side) ----------
export async function getContent(keys: string[]): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("key, value").in("key", keys);

  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = data?.find((d) => d.key === key)?.value ?? DEFAULT_CONTENT[key] ?? "";
  }
  return result;
}

export async function getSeo(pageKey: string): Promise<{ title: string; description: string }> {
  const supabase = await createClient();
  const { data } = await supabase.from("page_seo").select("title, description").eq("page_key", pageKey).maybeSingle();

  const fallback = DEFAULT_SEO[pageKey] ?? { title: "কাজকরো", description: "" };
  return {
    title: data?.title || fallback.title,
    description: data?.description || fallback.description,
  };
}

// ---------- Tiny markdown-lite renderer ----------
// Supports: blank-line-separated paragraphs, "## heading" lines, and
// "- bullet" list blocks. Intentionally minimal — no HTML injection risk
// since everything is escaped by React by default (no dangerouslySetInnerHTML).
export function parseMiniMarkdown(text: string): { type: "h2" | "p" | "ul"; content: string | string[] }[] {
  const blocks: { type: "h2" | "p" | "ul"; content: string | string[] }[] = [];
  const lines = text.split("\n");
  let currentList: string[] = [];

  function flushList() {
    if (currentList.length > 0) {
      blocks.push({ type: "ul", content: currentList });
      currentList = [];
    }
  }

  let paragraph: string[] = [];
  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", content: paragraph.join(" ") });
      paragraph = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", content: line.slice(3) });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      currentList.push(line.slice(2));
    } else if (line === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return blocks;
}
