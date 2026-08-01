import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = !!profile?.is_admin;
  }

  return (
    <header className="border-b" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="display flex items-center gap-1 text-2xl font-bold">
          <span style={{ color: "var(--cobalt)" }}>কাজ</span>
          <span style={{ color: "var(--vermillion)" }}>করো</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/jobs" className="hover:opacity-70">
            কাজ খুঁজুন
          </Link>
          <Link href="/workers" className="hover:opacity-70">
            কর্মী খুঁজুন
          </Link>
          <Link href="/jobs/new" className="hover:opacity-70">
            কাজ পোস্ট করুন
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-white"
              style={{ background: "var(--vermillion)" }}
            >
              <ShieldCheck size={14} /> অ্যাডমিন প্যানেল
            </Link>
          )}

          {user ? (
            <Link
              href="/profile"
              className="rounded-full border px-4 py-1.5"
              style={{ borderColor: "var(--ink)" }}
            >
              আমার প্রোফাইল
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-4 py-1.5 text-white"
              style={{ background: "var(--cobalt)" }}
            >
              লগইন
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
