"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  open: "নতুন",
  in_progress: "প্রক্রিয়াধীন",
  resolved: "সমাধান হয়েছে",
};

const STATUS_COLOR: Record<string, string> = {
  open: "var(--vermillion)",
  in_progress: "var(--marigold-deep)",
  resolved: "var(--leaf)",
};

export default function SupportMessageRow({ message }: { message: SupportMessage }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await supabase.from("support_messages").update({ status }).eq("id", message.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{message.subject || "(কোনো বিষয় দেওয়া হয়নি)"}</p>
          <p className="text-xs" style={{ color: "#8a8478" }}>
            {message.name} · {message.email} · {new Date(message.created_at).toLocaleDateString("bn-BD")}
          </p>
        </div>
        <select
          value={message.status}
          disabled={loading}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border px-2 py-1 text-xs font-medium"
          style={{ borderColor: STATUS_COLOR[message.status], color: STATUS_COLOR[message.status] }}
        >
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-sm" style={{ color: "#4a4640" }}>
        {message.message}
      </p>
    </div>
  );
}
