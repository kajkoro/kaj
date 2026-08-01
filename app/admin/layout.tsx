export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Users, Briefcase, Tags, Settings, MessageSquare, ExternalLink } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const navItems = [
    { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { href: "/admin/users", label: "ইউজার", icon: Users },
    { href: "/admin/jobs", label: "কাজসমূহ", icon: Briefcase },
    { href: "/admin/skills", label: "স্কিল ক্যাটাগরি", icon: Tags },
    { href: "/admin/support", label: "সাপোর্ট মেসেজ", icon: MessageSquare },
    { href: "/admin/settings", label: "সাইট সেটিংস", icon: Settings },
  ];

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8">
      <aside className="w-56 shrink-0">
        <div className="sticky top-8">
          <p className="mono-ui mb-1 text-xs" style={{ color: "#8a8478" }}>
            অ্যাডমিন
          </p>
          <p className="mb-6 font-semibold">{profile.full_name}</p>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--paper)]"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ color: "#6b665c" }}
          >
            <ExternalLink size={14} /> সাইটে ফিরে যান
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
