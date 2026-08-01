import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/JobCard";
import { AREAS } from "@/lib/types";
import Link from "next/link";
import { getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("jobs");
  return { title: seo.title, description: seo.description };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*, skill_categories(*)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (area) query = query.eq("area", area);

  const { data: jobs } = await query;

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl font-bold">খোলা কাজসমূহ</h1>
        <Link href="/jobs/new" className="btn-primary text-sm">
          + নতুন কাজ পোস্ট করুন
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/jobs"
          className="rounded-full border px-3 py-1 text-sm"
          style={{
            borderColor: "var(--ink)",
            background: !area ? "var(--ink)" : "transparent",
            color: !area ? "white" : "var(--ink)",
          }}
        >
          সব এলাকা
        </Link>
        {AREAS.map((a) => (
          <Link
            key={a}
            href={`/jobs?area=${encodeURIComponent(a)}`}
            className="rounded-full border px-3 py-1 text-sm"
            style={{
              borderColor: "var(--ink)",
              background: area === a ? "var(--ink)" : "transparent",
              color: area === a ? "white" : "var(--ink)",
            }}
          >
            {a}
          </Link>
        ))}
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center" style={{ color: "#6b665c" }}>
          এই মুহূর্তে কোনো খোলা কাজ নেই। প্রথম জব পোস্ট করুন!
        </p>
      )}
    </section>
  );
}
