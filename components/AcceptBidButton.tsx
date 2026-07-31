"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AcceptBidButton({ jobId, bidId, workerId }: { jobId: string; bidId: string; workerId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);

    await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId);
    await supabase
      .from("bids")
      .update({ status: "rejected" })
      .eq("job_id", jobId)
      .neq("id", bidId);
    await supabase
      .from("jobs")
      .update({ status: "assigned", assigned_worker_id: workerId })
      .eq("id", jobId);

    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={handleAccept} disabled={loading} className="btn-primary text-sm">
      {loading ? "নিশ্চিত হচ্ছে..." : "এই কর্মীকে নিয়োগ দিন"}
    </button>
  );
}
