import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import WorkerCard from "@/components/WorkerCard";
import { AREAS } from "@/lib/types";
import Link from "next/link";
import { getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("workers");
  return { title: seo.title, description: seo.description };
}

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("worker_profiles")
    .select("*, profiles(*), worker_skills(skill_categories(*))")
    .eq("is_active", true);

  const { data: workers } = await query;

  const filtered = area ? workers?.filter((w) => w.profiles?.area === area) : workers;

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="display text-3xl font-bold">কর্মী খুঁজুন</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/workers"
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
            href={`/workers?area=${encodeURIComponent(a)}`}
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

      {filtered && filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <WorkerCard key={w.user_id} worker={w} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center" style={{ color: "#6b665c" }}>
          এই এলাকায় এখনো কোনো কর্মী নেই।
        </p>
      )}
    </section>
  );
}
