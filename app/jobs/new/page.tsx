"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AREAS } from "@/lib/types";
import type { SkillCategory } from "@/lib/types";

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createClient();
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<{
    skill_id: string;
    title: string;
    description: string;
    area: string;
    estimated_hours: string;
    budget_hourly: string;
    scheduled_date: string;
    scheduled_time: string;
  }>({
    skill_id: "",
    title: "",
    description: "",
    area: AREAS[0],
    estimated_hours: "2",
    budget_hourly: "300",
    scheduled_date: "",
    scheduled_time: "",
  });

  useEffect(() => {
    supabase
      .from("skill_categories")
      .select("*")
      .order("name_bn")
      .then(({ data }) => setSkills(data ?? []));
  }, [supabase]);

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

    const { data: job, error: insertError } = await supabase
      .from("jobs")
      .insert({
        buyer_id: user.id,
        skill_id: Number(form.skill_id),
        title: form.title,
        description: form.description,
        area: form.area,
        estimated_hours: Number(form.estimated_hours),
        budget_hourly: form.budget_hourly ? Number(form.budget_hourly) : null,
        scheduled_date: form.scheduled_date || null,
        scheduled_time: form.scheduled_time || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/jobs/${job.id}`);
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-12">
      <h1 className="display text-3xl font-bold">নতুন কাজ পোস্ট করুন</h1>
      <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
        যত বিস্তারিত লিখবেন, তত ভালো বিড পাবেন।
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">কাজের ধরন</span>
          <select
            required
            value={form.skill_id}
            onChange={(e) => setForm({ ...form, skill_id: e.target.value })}
            className="input"
          >
            <option value="">নির্বাচন করুন</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_bn}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">শিরোনাম</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            placeholder="যেমন: কিচেন ও বাথরুম পরিষ্কার দরকার"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">বিস্তারিত</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
            rows={4}
            placeholder="কাজের বিস্তারিত লিখুন..."
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">এলাকা</span>
            <select
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="input"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">আনুমানিক ঘণ্টা</span>
            <input
              required
              type="number"
              min="0.5"
              step="0.5"
              value={form.estimated_hours}
              onChange={(e) => setForm({ ...form, estimated_hours: e.target.value })}
              className="input"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">তারিখ</span>
            <input
              type="date"
              value={form.scheduled_date}
              onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">সময়</span>
            <input
              type="time"
              value={form.scheduled_time}
              onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
              className="input"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">প্রস্তাবিত রেট (ঘণ্টাপ্রতি ৳, ঐচ্ছিক)</span>
          <input
            type="number"
            min="0"
            value={form.budget_hourly}
            onChange={(e) => setForm({ ...form, budget_hourly: e.target.value })}
            className="input"
          />
        </label>

        {error && (
          <p className="text-sm" style={{ color: "var(--vermillion)" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "পোস্ট হচ্ছে..." : "কাজ পোস্ট করুন"}
        </button>
      </form>
    </section>
  );
}
