import Link from "next/link";

export const metadata = { title: "সাপোর্ট | কাজকরো" };

const FAQS = [
  {
    q: "আমি কীভাবে ওয়ার্কার হিসেবে কাজ শুরু করব?",
    a: "সাইন আপ করে প্রোফাইল পেজে গিয়ে 'আমি কাজ করতে চাই' অপশন চালু করুন, এলাকা, ঘণ্টা-রেট, এবং সর্বোচ্চ ৫টি কাজের ধরন বেছে নিন। এরপর খোলা কাজগুলোতে বিড করা শুরু করতে পারবেন।",
  },
  {
    q: "NID ভেরিফিকেশন কেন দরকার?",
    a: "নিরাপত্তার স্বার্থে — বায়ার ও ওয়ার্কার উভয়ের পরিচয় নিশ্চিত করার জন্য এটা গুরুত্বপূর্ণ। ভেরিফিকেশন ছাড়া কিছু ফিচার সীমিত থাকতে পারে।",
  },
  {
    q: "পেমেন্ট কীভাবে হয়?",
    a: "কাজ সম্পন্ন হওয়ার পর ক্যাশ বা কার্ডের মাধ্যমে পেমেন্ট করা যায়, বায়ার ও ওয়ার্কারের সম্মতি অনুযায়ী।",
  },
  {
    q: "কমিশন কত?",
    a: "প্রতিটি সম্পন্ন কাজের উপর একটি নির্দিষ্ট শতাংশ কমিশন প্রযোজ্য হয়, যা সাইটে উল্লেখ করা থাকে।",
  },
  {
    q: "কোনো সমস্যা বা বিরোধ হলে কী করব?",
    a: "যোগাযোগ পেজ থেকে আমাদের বিস্তারিত জানান, আমরা যত দ্রুত সম্ভব সহায়তা করার চেষ্টা করব।",
  },
];

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-14">
      <h1 className="display text-3xl font-bold">সাপোর্ট</h1>
      <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
        সচরাচর জিজ্ঞাসিত প্রশ্ন। নিচে উত্তর না পেলে সরাসরি{" "}
        <Link href="/contact" className="underline" style={{ color: "var(--cobalt)" }}>
          যোগাযোগ করুন
        </Link>
        ।
      </p>

      <div className="mt-8 space-y-4">
        {FAQS.map((f, i) => (
          <details key={i} className="ticket p-4" open={i === 0}>
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-sm" style={{ color: "#4a4640" }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
