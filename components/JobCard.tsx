import Link from "next/link";
import type { Job } from "@/lib/types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="ticket ticket-perforation p-5 transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mono-ui mb-2 flex justify-between text-xs" style={{ color: "#8a8478" }}>
          <span>JOB #{job.id.slice(0, 6).toUpperCase()}</span>
          <span>{job.area}</span>
        </div>
        <h3 className="display text-lg font-bold">
          {job.skill_categories?.name_bn ?? job.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm" style={{ color: "#4a4640" }}>
          {job.description || "বিস্তারিত জানতে ক্লিক করুন"}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-dashed pt-3">
          <span className="text-sm">আনুমানিক {job.estimated_hours} ঘণ্টা</span>
          {job.budget_hourly && (
            <span className="mono-ui font-bold" style={{ color: "var(--cobalt)" }}>
              ৳{job.budget_hourly}/ঘণ্টা
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
