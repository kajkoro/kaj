import { Star, ShieldCheck } from "lucide-react";
import type { WorkerProfile } from "@/lib/types";

export default function WorkerCard({ worker }: { worker: WorkerProfile }) {
  const profile = worker.profiles;
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="display flex items-center gap-1.5 text-lg font-bold">
            {profile?.full_name}
            {profile?.nid_verified && <ShieldCheck size={16} color="var(--leaf)" />}
          </h3>
          <p className="text-sm" style={{ color: "#6b665c" }}>
            {profile?.area}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} fill="var(--marigold)" color="var(--marigold)" />
          <span>{profile?.rating_avg?.toFixed(1) ?? "নতুন"}</span>
        </div>
      </div>

      <p className="mt-3 text-sm" style={{ color: "#4a4640" }}>
        {worker.bio}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {worker.worker_skills?.map((ws, i) => (
          <span
            key={i}
            className="rounded-full px-2.5 py-1 text-xs"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
          >
            {ws.skill_categories.name_bn}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--line)" }}>
        <span className="mono-ui text-lg font-bold" style={{ color: "var(--cobalt)" }}>
          ৳{worker.hourly_rate}/ঘণ্টা
        </span>
      </div>
    </div>
  );
}
