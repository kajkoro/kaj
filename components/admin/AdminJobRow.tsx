"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";

const STATUS_OPTIONS = ["open", "assigned", "completed", "cancelled"] as const;

export default function AdminJobRow({ job }: { job: Job }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: string) {
    setLoading(true);
    await supabase.from("jobs").update({ status }).eq("id", job.id);
    setLoading(false);
    router.refresh();
  }

  async function deleteJob() {
    if (!confirm("এই কাজটি স্থায়ীভাবে মুছে ফেলতে চান? এর সাথে সংশ্লিষ্ট সব বিডও মুছে যাবে।")) return;
    setLoading(true);
    await supabase.from("jobs").delete().eq("id", job.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <tr className="border-b text-sm" style={{ borderColor: "var(--line)" }}>
      <td className="py-3 pr-4">
        <p className="font-medium">{job.skill_categories?.name_bn ?? job.title}</p>
        <p className="text-xs" style={{ color: "#8a8478" }}>
          #{job.id.slice(0, 6)} · {job.area}
        </p>
      </td>
      <td className="py-3 pr-4">{job.estimated_hours} ঘণ্টা</td>
      <td className="py-3 pr-4">{job.budget_hourly ? `৳${job.budget_hourly}/ঘণ্টা` : "—"}</td>
      <td className="py-3 pr-4">
        <select
          value={job.status}
          disabled={loading}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-lg border px-2 py-1 text-xs"
          style={{ borderColor: "var(--line)" }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3">
        <button
          onClick={deleteJob}
          disabled={loading}
          className="text-xs font-medium"
          style={{ color: "var(--vermillion)" }}
        >
          মুছে ফেলুন
        </button>
      </td>
    </tr>
  );
}
