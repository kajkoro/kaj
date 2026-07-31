"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AREAS } from "@/lib/types";
import type { Profile, SkillCategory } from "@/lib/types";

export default function ProfileEditor() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [allSkills, setAllSkills] = useState<SkillCategory[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [hourlyRate, setHourlyRate] = useState("300");
  const [bio, setBio] = useState("");
  const [area, setArea] = useState<string>(AREAS[0]);
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: p }, { data: skills }, { data: wp }, { data: ws }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("skill_categories").select("*").order("name_bn"),
        supabase.from("worker_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("worker_skills").select("skill_id").eq("worker_id", user.id),
      ]);

      setProfile(p);
      setAllSkills(skills ?? []);
      if (p?.area) setArea(p.area);
      if (wp) {
        setIsWorker(true);
        setHourlyRate(wp.hourly_rate.toString());
        setBio(wp.bio ?? "");
      }
      if (ws) setSelectedSkills(ws.map((s) => s.skill_id));
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  function toggleSkill(id: number) {
    setSelectedSkills((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 5) {
        setMessage("সর্বোচ্চ ৫টি কাজের ধরন বাছাই করা যাবে।");
        return prev;
      }
      return [...prev, id];
    });
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    await supabase.from("profiles").update({ area, role: isWorker ? "both" : "buyer" }).eq("id", profile.id);

    if (isWorker) {
      await supabase
        .from("worker_profiles")
        .upsert({ user_id: profile.id, hourly_rate: Number(hourlyRate), bio });

      // reset & reinsert skills (simple approach for MVP)
      await supabase.from("worker_skills").delete().eq("worker_id", profile.id);
      if (selectedSkills.length > 0) {
        await supabase
          .from("worker_skills")
          .insert(selectedSkills.map((skill_id) => ({ worker_id: profile.id, skill_id })));
      }
    }

    setSaving(false);
    setMessage("প্রোফাইল সংরক্ষণ হয়েছে ✓");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="px-5 py-16 text-center">লোড হচ্ছে...</p>;
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl font-bold">{profile?.full_name}</h1>
        <button onClick={handleSignOut} className="text-sm underline">
          লগআউট
        </button>
      </div>

      {!profile?.nid_verified && (
        <div
          className="mt-4 rounded-xl p-4 text-sm"
          style={{ background: "#fff8e8", border: "1px solid var(--marigold)" }}
        >
          আপনার NID এখনো ভেরিফাই করা হয়নি। ভেরিফিকেশন ছাড়া কাজে বিড করা বা কর্মী হায়ার করা সীমিত থাকবে।
          <br />
          <span className="font-semibold">(NID ভেরিফিকেশন ফ্লো এখনো ইন্টিগ্রেট করা হয়নি — README দেখুন)</span>
        </div>
      )}

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">এলাকা</span>
          <select value={area} onChange={(e) => setArea(e.target.value)} className="input">
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isWorker}
            onChange={(e) => setIsWorker(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="font-medium">আমি কাজ করতে চাই (ওয়ার্কার হিসেবে তালিকাভুক্ত হতে চাই)</span>
        </label>

        {isWorker && (
          <div className="space-y-4 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">ঘণ্টাপ্রতি রেট (৳)</span>
              <input
                type="number"
                min="1"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">সংক্ষিপ্ত পরিচিতি</span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input" rows={3} />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium">
                কাজের ধরন নির্বাচন করুন (সর্বোচ্চ ৫টি) — {selectedSkills.length}/5
              </span>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s) => {
                  const active = selectedSkills.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className="rounded-full border px-3 py-1.5 text-sm"
                      style={{
                        borderColor: active ? "var(--cobalt)" : "var(--line)",
                        background: active ? "var(--cobalt)" : "transparent",
                        color: active ? "white" : "var(--ink)",
                      }}
                    >
                      {s.name_bn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {message && <p className="text-sm">{message}</p>}

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন"}
        </button>
      </div>
    </section>
  );
}
