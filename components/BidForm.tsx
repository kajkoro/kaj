"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BidForm({ jobId, defaultRate }: { jobId: string; defaultRate: number | null }) {
  const router = useRouter();
  const supabase = createClient();
  const [rate, setRate] = useState(defaultRate?.toString() ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: bidError } = await supabase.from("bids").insert({
      job_id: jobId,
      worker_id: user.id,
      rate_offered: Number(rate),
      message,
    });

    if (bidError) {
      setError(
        bidError.code === "23505" ? "আপনি ইতিমধ্যে এই কাজে বিড করেছেন।" : bidError.message
      );
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: "var(--paper)", border: "1px solid var(--leaf)" }}>
        ✓ আপনার বিড জমা হয়েছে। বায়ার গ্রহণ করলে আপনাকে জানানো হবে।
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
      <p className="font-semibold">এই কাজে বিড করুন</p>
      <label className="block">
        <span className="mb-1 block text-sm">আপনার রেট (৳/ঘণ্টা)</span>
        <input
          required
          type="number"
          min="1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm">সংক্ষিপ্ত বার্তা (ঐচ্ছিক)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
          rows={2}
        />
      </label>
      {error && <p className="text-sm" style={{ color: "var(--vermillion)" }}>{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
        {loading ? "জমা হচ্ছে..." : "বিড জমা দিন"}
      </button>
    </form>
  );
}
