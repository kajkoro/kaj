import { createClient } from "@/lib/supabase/server";
import { Users, Briefcase, Gavel, ShieldCheck, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalWorkers },
    { count: openJobs },
    { count: assignedJobs },
    { count: completedJobs },
    { count: totalBids },
    { count: unverifiedNid },
    { count: openSupport },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("worker_profiles").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "assigned"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("bids").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("nid_verified", false),
    supabase.from("support_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  const stats = [
    { label: "মোট ইউজার", value: totalUsers ?? 0, icon: Users, color: "var(--cobalt)" },
    { label: "ওয়ার্কার প্রোফাইল", value: totalWorkers ?? 0, icon: Users, color: "var(--leaf)" },
    { label: "খোলা কাজ", value: openJobs ?? 0, icon: Briefcase, color: "var(--marigold-deep)" },
    { label: "নিয়োগপ্রাপ্ত কাজ", value: assignedJobs ?? 0, icon: Briefcase, color: "var(--cobalt)" },
    { label: "সম্পন্ন কাজ", value: completedJobs ?? 0, icon: Briefcase, color: "var(--leaf)" },
    { label: "মোট বিড", value: totalBids ?? 0, icon: Gavel, color: "var(--vermillion)" },
  ];

  return (
    <div>
      <h1 className="display text-2xl font-bold">ড্যাশবোর্ড</h1>

      {(unverifiedNid ?? 0) > 0 || (openSupport ?? 0) > 0 ? (
        <div className="mt-4 space-y-2">
          {(unverifiedNid ?? 0) > 0 && (
            <AlertBanner
              icon={<ShieldCheck size={16} />}
              text={`${unverifiedNid} জন ইউজারের NID এখনো ভেরিফাই করা হয়নি`}
              href="/admin/users?filter=unverified"
            />
          )}
          {(openSupport ?? 0) > 0 && (
            <AlertBanner
              icon={<AlertCircle size={16} />}
              text={`${openSupport}টি সাপোর্ট মেসেজ উত্তরের অপেক্ষায়`}
              href="/admin/support"
            />
          )}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
            <s.icon size={20} color={s.color} />
            <p className="mono-ui mt-3 text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertBanner({ icon, text, href }: { icon: React.ReactNode; text: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
      style={{ background: "#fff8e8", border: "1px solid var(--marigold)" }}
    >
      {icon} {text}
    </a>
  );
}
