import { createClient } from "@/lib/supabase/server";
import { Eye, Users, TrendingUp } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: views } = await supabase
    .from("page_views")
    .select("path, referrer, session_id, created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: false })
    .limit(10000);

  const totalViews = views?.length ?? 0;
  const uniqueSessions = new Set(views?.map((v) => v.session_id).filter(Boolean)).size;

  // views per day for last 14 days
  const dayCounts = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayCounts.set(d.toISOString().slice(0, 10), 0);
  }
  views?.forEach((v) => {
    const day = v.created_at.slice(0, 10);
    if (dayCounts.has(day)) dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  });
  const dailySeries = Array.from(dayCounts.entries());
  const maxDaily = Math.max(1, ...dailySeries.map(([, c]) => c));

  // top pages
  const pageCounts = new Map<string, number>();
  views?.forEach((v) => pageCounts.set(v.path, (pageCounts.get(v.path) ?? 0) + 1));
  const topPages = Array.from(pageCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // top referrers
  const refCounts = new Map<string, number>();
  views?.forEach((v) => {
    let ref = "সরাসরি / জানা নেই";
    if (v.referrer) {
      try {
        ref = new URL(v.referrer).hostname;
      } catch {
        ref = "সরাসরি / জানা নেই";
      }
    }
    refCounts.set(ref, (refCounts.get(ref) ?? 0) + 1);
  });
  const topReferrers = Array.from(refCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div>
      <h1 className="display text-2xl font-bold">ট্রাফিক অ্যানালিটিক্স</h1>
      <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
        সর্বশেষ ৩০ দিনের ডেটা (সর্বোচ্চ ১০,০০০টি ভিজিট)।
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatBox icon={<Eye size={20} color="var(--cobalt)" />} value={totalViews} label="মোট পেজভিউ" />
        <StatBox icon={<Users size={20} color="var(--leaf)" />} value={uniqueSessions} label="ইউনিক ভিজিটর সেশন" />
        <StatBox
          icon={<TrendingUp size={20} color="var(--marigold-deep)" />}
          value={dailySeries[dailySeries.length - 1]?.[1] ?? 0}
          label="আজকের ভিজিট"
        />
      </div>

      {/* Daily chart */}
      <div className="mt-8 rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
        <p className="mb-4 text-sm font-semibold">গত ১৪ দিনের ভিজিট</p>
        <div className="flex h-32 items-end gap-2">
          {dailySeries.map(([day, count]) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(4, (count / maxDaily) * 100)}%`,
                  background: "var(--cobalt)",
                }}
                title={`${day}: ${count}`}
              />
              <span className="mono-ui text-[10px]" style={{ color: "#8a8478" }}>
                {day.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
          <p className="mb-3 text-sm font-semibold">সবচেয়ে বেশি দেখা পেজ</p>
          <div className="space-y-2">
            {topPages.map(([path, count]) => (
              <Bar key={path} label={path} count={count} max={topPages[0]?.[1] ?? 1} />
            ))}
            {topPages.length === 0 && <EmptyNote />}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
          <p className="mb-3 text-sm font-semibold">কোথা থেকে ভিজিটর আসছে</p>
          <div className="space-y-2">
            {topReferrers.map(([ref, count]) => (
              <Bar key={ref} label={ref} count={count} max={topReferrers[0]?.[1] ?? 1} />
            ))}
            {topReferrers.length === 0 && <EmptyNote />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--line)" }}>
      {icon}
      <p className="mono-ui mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs" style={{ color: "#6b665c" }}>
        {label}
      </p>
    </div>
  );
}

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="truncate" style={{ color: "#3a362f" }}>
          {label}
        </span>
        <span className="mono-ui font-semibold">{count}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full" style={{ background: "var(--paper)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${(count / max) * 100}%`, background: "var(--marigold)" }}
        />
      </div>
    </div>
  );
}

function EmptyNote() {
  return (
    <p className="text-sm" style={{ color: "#8a8478" }}>
      এখনো কোনো ডেটা নেই।
    </p>
  );
}
