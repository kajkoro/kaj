"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface SeoItem {
  page_key: string;
  title: string;
  description: string;
}

const PAGE_LABELS: Record<string, string> = {
  home: "হোমপেজ",
  jobs: "কাজ খুঁজুন",
  workers: "কর্মী খুঁজুন",
  privacy: "প্রাইভেসি পলিসি",
  terms: "টার্মস অ্যান্ড কন্ডিশন",
  disclaimer: "ডিসক্লেইমার",
  support: "সাপোর্ট",
  contact: "যোগাযোগ",
};

export default function SeoManager({ items }: { items: SeoItem[] }) {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, { title: string; description: string }>>(
    Object.fromEntries(items.map((i) => [i.page_key, { title: i.title, description: i.description }]))
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  async function save(page_key: string) {
    setSavingKey(page_key);
    setSavedKey(null);
    await supabase.from("page_seo").upsert({
      page_key,
      title: values[page_key].title,
      description: values[page_key].description,
      updated_at: new Date().toISOString(),
    });
    setSavingKey(null);
    setSavedKey(page_key);
    setTimeout(() => setSavedKey(null), 2000);
  }

  return (
    <div className="mt-6 space-y-5">
      {items.map((item) => {
        const v = values[item.page_key];
        return (
          <div key={item.page_key} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
            <p className="mb-3 text-sm font-semibold">{PAGE_LABELS[item.page_key] ?? item.page_key}</p>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs" style={{ color: "#8a8478" }}>
                মেটা টাইটেল ({v.title.length}/৬০)
              </span>
              <input
                value={v.title}
                onChange={(e) =>
                  setValues({ ...values, [item.page_key]: { ...v, title: e.target.value } })
                }
                className="input"
                maxLength={70}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs" style={{ color: "#8a8478" }}>
                মেটা ডেসক্রিপশন ({v.description.length}/১৬০)
              </span>
              <textarea
                value={v.description}
                onChange={(e) =>
                  setValues({ ...values, [item.page_key]: { ...v, description: e.target.value } })
                }
                className="input"
                rows={2}
                maxLength={200}
              />
            </label>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => save(item.page_key)}
                disabled={savingKey === item.page_key}
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                style={{ background: "var(--cobalt)" }}
              >
                {savingKey === item.page_key ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
              {savedKey === item.page_key && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--leaf)" }}>
                  <Check size={14} /> সংরক্ষিত হয়েছে
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
