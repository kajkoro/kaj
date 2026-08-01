"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, ShieldOff, Ban, ShieldQuestion } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function UserRow({ user }: { user: Profile }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(field: "nid_verified" | "is_suspended" | "is_admin") {
    setLoading(field);
    await supabase
      .from("profiles")
      .update({ [field]: !user[field] })
      .eq("id", user.id);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await supabase.from("admin_audit_log").insert({
        admin_id: authUser.id,
        action: `toggle_${field}`,
        target_table: "profiles",
        target_id: user.id,
        details: { new_value: !user[field] },
      });
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <tr className="border-b" style={{ borderColor: "var(--line)" }}>
      <td className="py-3 pr-4">
        <p className="font-medium">{user.full_name}</p>
        <p className="text-xs" style={{ color: "#8a8478" }}>
          {user.phone ?? "ফোন নেই"} · {user.area ?? "এলাকা নেই"}
        </p>
      </td>
      <td className="py-3 pr-4 text-sm">{user.role}</td>
      <td className="py-3 pr-4 text-sm">
        {user.rating_count > 0 ? `${user.rating_avg.toFixed(1)} ★ (${user.rating_count})` : "—"}
      </td>
      <td className="py-3 pr-4">
        {user.is_suspended && (
          <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: "var(--vermillion)" }}>
            সাসপেন্ডেড
          </span>
        )}
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <ActionButton
            active={user.nid_verified}
            loading={loading === "nid_verified"}
            onClick={() => toggle("nid_verified")}
            activeIcon={<ShieldCheck size={14} />}
            inactiveIcon={<ShieldQuestion size={14} />}
            activeLabel="NID ভেরিফাইড"
            inactiveLabel="NID ভেরিফাই করুন"
          />
          <ActionButton
            active={!user.is_suspended}
            loading={loading === "is_suspended"}
            onClick={() => toggle("is_suspended")}
            activeIcon={<Ban size={14} />}
            inactiveIcon={<ShieldOff size={14} />}
            activeLabel="সাসপেন্ড করুন"
            inactiveLabel="আনসাসপেন্ড করুন"
            danger
          />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  active,
  loading,
  onClick,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
  danger,
}: {
  active: boolean;
  loading: boolean;
  onClick: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeLabel: string;
  inactiveLabel: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-50"
      style={{
        borderColor: active ? (danger ? "var(--vermillion)" : "var(--leaf)") : "var(--line)",
        color: active ? (danger ? "var(--vermillion)" : "var(--leaf)") : "#6b665c",
      }}
    >
      {active ? activeIcon : inactiveIcon}
      {loading ? "..." : active ? activeLabel : inactiveLabel}
    </button>
  );
}
