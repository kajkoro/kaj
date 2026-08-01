"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface ContentItem {
  key: string;
  label: string;
  value: string;
}

export default function ContentManager({ items }: { items: ContentItem[] }) {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.key, i.value]))
  );
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  async function save(key: string) {
    setSavingKey(key);
    setSavedKey(null);
    await supabase
      .from("site_content")
      .upsert({ key, value: values[key], updated_at: new Date().toISOString() });
    setSavingKey(null);
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  }

  return (
    <div className="mt-6 space-y-6">
      {items.map((item) => (
        <div key={item.key} className="rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
          <label className="mb-2 block text-sm font-semibold">{item.label}</label>
          <textarea
            value={values[item.key]}
            onChange={(e) => setValues({ ...values, [item.key]: e.target.value })}
            className="input font-mono text-xs"
            rows={item.value.length > 300 ? 12 : 4}
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => save(item.key)}
              disabled={savingKey === item.key}
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
              style={{ background: "var(--cobalt)" }}
            >
              {savingKey === item.key ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </button>
            {savedKey === item.key && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--leaf)" }}>
                <Check size={14} /> সংরক্ষিত হয়েছে
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
