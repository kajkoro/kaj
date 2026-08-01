import { createClient } from "@/lib/supabase/server";
import AdminJobRow from "@/components/admin/AdminJobRow";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*, skill_categories(*)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: jobs } = await query;

  return (
    <div>
      <h1 className="display text-2xl font-bold">সব কাজ</h1>

      <div className="mt-4 flex gap-2 text-sm">
        {["", "open", "assigned", "completed", "cancelled"].map((s) => (
          <a
            key={s}
            href={s ? `/admin/jobs?status=${s}` : "/admin/jobs"}
            className="rounded-full border px-3 py-1"
            style={{
              borderColor: "var(--ink)",
              background: status === s || (!status && !s) ? "var(--ink)" : "transparent",
              color: status === s || (!status && !s) ? "white" : "var(--ink)",
            }}
          >
            {s || "সব"}
          </a>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white" style={{ borderColor: "var(--line)" }}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs" style={{ borderColor: "var(--line)", color: "#8a8478" }}>
              <th className="px-4 py-3">কাজ</th>
              <th className="px-4 py-3">সময়</th>
              <th className="px-4 py-3">রেট</th>
              <th className="px-4 py-3">স্ট্যাটাস</th>
              <th className="px-4 py-3">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.map((j) => (
              <AdminJobRow key={j.id} job={j} />
            ))}
          </tbody>
        </table>
        {(!jobs || jobs.length === 0) && (
          <p className="p-6 text-center text-sm" style={{ color: "#6b665c" }}>
            কোনো কাজ পাওয়া যায়নি।
          </p>
        )}
      </div>
    </div>
  );
}
