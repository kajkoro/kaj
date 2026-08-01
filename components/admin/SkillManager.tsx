"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus } from "lucide-react";
import type { SkillCategory } from "@/lib/types";

const GROUPS = [
  { value: "household", label: "বাসাবাড়ি" },
  { value: "office", label: "অফিস" },
  { value: "restaurant", label: "রেস্টুরেন্ট" },
  { value: "education", label: "শিক্ষা" },
];

export default function SkillManager({ initialSkills }: { initialSkills: SkillCategory[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [skills, setSkills] = useState(initialSkills);
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [group, setGroup] = useState(GROUPS[0].value);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addSkill(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("skill_categories")
      .insert({ name_bn: nameBn, name_en: nameEn, group_name: group })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSkills((prev) => [...prev, data]);
    setNameBn("");
    setNameEn("");
    setLoading(false);
    router.refresh();
  }

  async function deleteSkill(id: number) {
    if (!confirm("এই স্কিলটি মুছে ফেললে সংশ্লিষ্ট ওয়ার্কার-স্কিল সংযোগও মুছে যাবে। নিশ্চিত?")) return;
    await supabase.from("skill_categories").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    router.refresh();
  }

  const grouped = GROUPS.map((g) => ({
    ...g,
    items: skills.filter((s) => s.group_name === g.value),
  }));

  return (
    <div className="mt-6">
      <form onSubmit={addSkill} className="flex flex-wrap items-end gap-3 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
        <label className="block">
          <span className="mb-1 block text-xs font-medium">বাংলা নাম</span>
          <input required value={nameBn} onChange={(e) => setNameBn(e.target.value)} className="input w-48" placeholder="যেমন: গাড়ি ধোয়া" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium">English name</span>
          <input required value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="input w-48" placeholder="e.g. Car washing" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium">গ্রুপ</span>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="input w-40">
            {GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} /> যোগ করুন
        </button>
      </form>
      {error && <p className="mt-2 text-sm" style={{ color: "var(--vermillion)" }}>{error}</p>}

      <div className="mt-6 space-y-6">
        {grouped.map((g) => (
          <div key={g.value}>
            <p className="mono-ui mb-2 text-xs font-semibold" style={{ color: "#8a8478" }}>
              {g.label.toUpperCase()} ({g.items.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                  style={{ borderColor: "var(--line)" }}
                >
                  {s.name_bn}
                  <button onClick={() => deleteSkill(s.id)} aria-label="মুছুন">
                    <Trash2 size={13} color="var(--vermillion)" />
                  </button>
                </span>
              ))}
              {g.items.length === 0 && (
                <span className="text-sm" style={{ color: "#8a8478" }}>
                  কোনো স্কিল নেই
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
