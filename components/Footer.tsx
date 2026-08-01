import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="display flex items-center gap-1 text-xl font-bold">
              <span style={{ color: "var(--cobalt)" }}>কাজ</span>
              <span style={{ color: "var(--vermillion)" }}>করো</span>
            </p>
            <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
              ছোট কাজ, বড় ভরসা। ঢাকার ঘণ্টাভিত্তিক কাজের মার্কেটপ্লেস।
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">প্ল্যাটফর্ম</p>
            <ul className="space-y-1.5 text-sm" style={{ color: "#6b665c" }}>
              <li><Link href="/jobs" className="hover:underline">কাজ খুঁজুন</Link></li>
              <li><Link href="/workers" className="hover:underline">কর্মী খুঁজুন</Link></li>
              <li><Link href="/jobs/new" className="hover:underline">কাজ পোস্ট করুন</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">সহায়তা ও নীতিমালা</p>
            <ul className="space-y-1.5 text-sm" style={{ color: "#6b665c" }}>
              <li><Link href="/support" className="hover:underline">সাপোর্ট</Link></li>
              <li><Link href="/contact" className="hover:underline">যোগাযোগ</Link></li>
              <li><Link href="/privacy" className="hover:underline">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms" className="hover:underline">টার্মস অ্যান্ড কন্ডিশন</Link></li>
              <li><Link href="/disclaimer" className="hover:underline">ডিসক্লেইমার</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-xs" style={{ borderColor: "var(--line)", color: "#8a8478" }}>
          © {new Date().getFullYear()} কাজকরো। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
