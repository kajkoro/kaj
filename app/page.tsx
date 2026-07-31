import Link from "next/link";
import { ShieldCheck, Clock, Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mono-ui mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide"
               style={{ background: "var(--marigold)", color: "var(--ink)" }}>
              ঢাকার প্রথম ঘণ্টাভিত্তিক কাজের মার্কেটপ্লেস
            </p>
            <h1 className="display text-5xl leading-tight font-bold md:text-6xl">
              ২ ঘণ্টার কাজ,
              <br />
              <span style={{ color: "var(--vermillion)" }}>নিজের এলাকায়,</span>
              <br />
              নিজের রেটে।
            </h1>
            <p className="mt-6 max-w-md text-lg" style={{ color: "#4a4640" }}>
              সাদিয়ার বাসার কিচেন পরিষ্কার দরকার, দুই ঘণ্টার জন্য। আফরিন
              ধানমন্ডিতেই থাকে, ভার্সিটিতে পড়ে, সময় বের করতে পারে। কাজকরো
              দুজনকে মেলায় — নিরাপদে, স্বচ্ছভাবে।
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/jobs/new"
                className="flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"
                style={{ background: "var(--cobalt)" }}
              >
                কাজ পোস্ট করুন <ArrowRight size={18} />
              </Link>
              <Link
                href="/jobs"
                className="flex items-center gap-2 rounded-full border-2 px-6 py-3 font-semibold"
                style={{ borderColor: "var(--ink)" }}
              >
                কাজ খুঁজে আয় করুন
              </Link>
            </div>
          </div>

          {/* Ticket-stub example card — signature visual */}
          <div className="ticket ticket-perforation mx-auto max-w-sm p-6">
            <div className="mono-ui mb-3 flex justify-between text-xs" style={{ color: "#8a8478" }}>
              <span>JOB #0142</span>
              <span>ধানমন্ডি</span>
            </div>
            <h3 className="display text-xl font-bold">কিচেন ও বাথরুম পরিষ্কার</h3>
            <p className="mt-1 text-sm" style={{ color: "#4a4640" }}>
              আনুমানিক ২ ঘণ্টা · আজ বিকাল ৫টা
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-dashed pt-4">
              <div>
                <p className="mono-ui text-2xl font-bold" style={{ color: "var(--cobalt)" }}>
                  ৳৩০০<span className="text-sm font-normal">/ঘণ্টা</span>
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: "var(--leaf)" }}
              >
                ৩ জন বিড করেছে
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
          <Feature
            icon={<ShieldCheck size={28} color="var(--cobalt)" />}
            title="NID ভেরিফাইড কর্মী"
            desc="প্রতিটি প্রোফাইল পরিচয়পত্র যাচাই করে অনুমোদন করা হয়, রেটিং সিস্টেমসহ।"
          />
          <Feature
            icon={<Clock size={28} color="var(--vermillion)" />}
            title="নিজের সময়ে কাজ"
            desc="দিনে সর্বোচ্চ যতটা সময় দিতে চান, ঠিক ততটাই — কোনো বাধ্যবাধকতা নেই।"
          />
          <Feature
            icon={<Wallet size={28} color="var(--marigold-deep)" />}
            title="স্বচ্ছ পেমেন্ট"
            desc="ক্যাশ অথবা কার্ডে পেমেন্ট, কাজ শেষ হওয়ার আগে কোনো টাকা লেনদেন হয় না।"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="display mb-10 text-3xl font-bold">যেভাবে কাজ করে</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="ticket p-6">
            <p className="mono-ui mb-2 text-xs font-semibold" style={{ color: "var(--vermillion)" }}>
              যিনি কাজ করাতে চান
            </p>
            <ol className="space-y-3 text-sm leading-relaxed">
              <li>১. এলাকা ও কাজের ধরন দিয়ে জব পোস্ট করুন</li>
              <li>২. আশেপাশের কর্মীদের বিড দেখুন ও তুলনা করুন</li>
              <li>৩. রেটিং দেখে পছন্দমতো কর্মী বাছাই করুন</li>
              <li>৪. কাজ শেষে রেটিং দিন, পেমেন্ট করুন</li>
            </ol>
          </div>
          <div className="ticket p-6">
            <p className="mono-ui mb-2 text-xs font-semibold" style={{ color: "var(--cobalt)" }}>
              যিনি কাজ করতে চান
            </p>
            <ol className="space-y-3 text-sm leading-relaxed">
              <li>১. প্রোফাইল সাজান — সর্বোচ্চ ৫টি কাজের ধরন বাছুন</li>
              <li>২. নিজের সময় ও ঘণ্টা-রেট উল্লেখ করুন</li>
              <li>৩. কাছাকাছি এলাকার জবে বিড করুন</li>
              <li>৪. কাজ করুন, রেটিং বাড়ান, আয় করুন</li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
