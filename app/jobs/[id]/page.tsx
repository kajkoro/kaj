import { createClient } from "@/lib/supabase/server";
import BidForm from "@/components/BidForm";
import AcceptBidButton from "@/components/AcceptBidButton";
import { Star, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, skill_categories(*), profiles!jobs_buyer_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!job) notFound();

  const { data: bids } = await supabase
    .from("bids")
    .select("*, profiles(*)")
    .eq("job_id", id)
    .order("rate_offered", { ascending: true });

  const isBuyer = user?.id === job.buyer_id;
  const alreadyBid = bids?.some((b) => b.worker_id === user?.id);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <div className="ticket ticket-perforation p-6">
        <div className="mono-ui mb-2 flex justify-between text-xs" style={{ color: "#8a8478" }}>
          <span>JOB #{job.id.slice(0, 6).toUpperCase()}</span>
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              background: job.status === "open" ? "var(--leaf)" : "var(--marigold)",
              color: "white",
            }}
          >
            {job.status === "open" ? "খোলা" : job.status === "assigned" ? "নিয়োগ দেওয়া হয়েছে" : "সম্পন্ন"}
          </span>
        </div>

        <h1 className="display text-2xl font-bold">{job.skill_categories?.name_bn ?? job.title}</h1>
        <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
          পোস্টকারী: {job.profiles?.full_name}
        </p>

        <p className="mt-4">{job.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed pt-4 text-sm sm:grid-cols-4">
          <Info label="এলাকা" value={job.area} />
          <Info label="আনুমানিক সময়" value={`${job.estimated_hours} ঘণ্টা`} />
          <Info label="তারিখ" value={job.scheduled_date ?? "নির্ধারিত নয়"} />
          <Info
            label="প্রস্তাবিত রেট"
            value={job.budget_hourly ? `৳${job.budget_hourly}/ঘণ্টা` : "খোলা"}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="display text-xl font-bold">বিডসমূহ ({bids?.length ?? 0})</h2>

        {bids && bids.length > 0 ? (
          <div className="mt-4 space-y-3">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="flex items-center justify-between rounded-xl border p-4"
                style={{ borderColor: "var(--line)" }}
              >
                <div>
                  <p className="flex items-center gap-1.5 font-semibold">
                    {bid.profiles?.full_name}
                    {bid.profiles?.nid_verified && <ShieldCheck size={14} color="var(--leaf)" />}
                    <span className="flex items-center gap-0.5 text-xs font-normal" style={{ color: "#6b665c" }}>
                      <Star size={12} fill="var(--marigold)" color="var(--marigold)" />
                      {bid.profiles?.rating_avg?.toFixed(1) ?? "নতুন"}
                    </span>
                  </p>
                  {bid.message && <p className="mt-1 text-sm" style={{ color: "#4a4640" }}>{bid.message}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="mono-ui font-bold" style={{ color: "var(--cobalt)" }}>
                    ৳{bid.rate_offered}/ঘণ্টা
                  </span>
                  {isBuyer && job.status === "open" && (
                    <AcceptBidButton jobId={job.id} bidId={bid.id} workerId={bid.worker_id} />
                  )}
                  {bid.status === "accepted" && (
                    <span className="text-xs font-semibold" style={{ color: "var(--leaf)" }}>
                      নিয়োগপ্রাপ্ত
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm" style={{ color: "#6b665c" }}>
            এখনো কোনো বিড আসেনি।
          </p>
        )}
      </div>

      {!isBuyer && job.status === "open" && !alreadyBid && (
        <div className="mt-8">
          <BidForm jobId={job.id} defaultRate={job.budget_hourly} />
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: "#8a8478" }}>
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
