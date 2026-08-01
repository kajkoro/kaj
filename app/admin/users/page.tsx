import { createClient } from "@/lib/supabase/server";
import UserRow from "@/components/admin/UserRow";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").order("full_name");

  if (filter === "unverified") query = query.eq("nid_verified", false);
  if (filter === "suspended") query = query.eq("is_suspended", true);
  if (q) query = query.ilike("full_name", `%${q}%`);

  const { data: users } = await query;

  return (
    <div>
      <h1 className="display text-2xl font-bold">ইউজার ব্যবস্থাপনা</h1>

      <form className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="নাম দিয়ে খুঁজুন..."
          className="input max-w-xs"
        />
        <button type="submit" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--ink)" }}>
          খুঁজুন
        </button>
      </form>

      <div className="mt-3 flex gap-2 text-sm">
        <FilterLink label="সবাই" href="/admin/users" active={!filter} />
        <FilterLink label="NID অ-ভেরিফাইড" href="/admin/users?filter=unverified" active={filter === "unverified"} />
        <FilterLink label="সাসপেন্ডেড" href="/admin/users?filter=suspended" active={filter === "suspended"} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white" style={{ borderColor: "var(--line)" }}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs" style={{ borderColor: "var(--line)", color: "#8a8478" }}>
              <th className="px-4 py-3">ইউজার</th>
              <th className="px-4 py-3">রোল</th>
              <th className="px-4 py-3">রেটিং</th>
              <th className="px-4 py-3">স্ট্যাটাস</th>
              <th className="px-4 py-3">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="px-4">
            {users?.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && (
          <p className="p-6 text-center text-sm" style={{ color: "#6b665c" }}>
            কোনো ইউজার পাওয়া যায়নি।
          </p>
        )}
      </div>
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className="rounded-full border px-3 py-1"
      style={{
        borderColor: "var(--ink)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "white" : "var(--ink)",
      }}
    >
      {label}
    </a>
  );
}
