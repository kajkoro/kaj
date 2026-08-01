"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("site_settings")
      .update({
        default_commission_pct: form.default_commission_pct,
        min_commission_pct: form.min_commission_pct,
        max_commission_pct: form.max_commission_pct,
        site_name_bn: form.site_name_bn,
        support_email: form.support_email,
        support_phone: form.support_phone,
        maintenance_mode: form.maintenance_mode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);

    setSaving(false);
    setMessage(error ? error.message : "সংরক্ষণ হয়েছে ✓");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="mt-6 max-w-lg space-y-5">
      <fieldset className="space-y-3 rounded-xl border p-4" style={{ borderColor: "var(--line)" }}>
        <legend className="px-1 text-sm font-semibold">কমিশন রেট (%)</legend>
        <div className="grid grid-cols-3 gap-3">
          <NumField label="ডিফল্ট" value={form.default_commission_pct} onChange={(v) => setForm({ ...form, default_commission_pct: v })} />
          <NumField label="সর্বনিম্ন" value={form.min_commission_pct} onChange={(v) => setForm({ ...form, min_commission_pct: v })} />
          <NumField label="সর্বোচ্চ" value={form.max_commission_pct} onChange={(v) => setForm({ ...form, max_commission_pct: v })} />
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">সাইটের নাম (বাংলা)</span>
        <input value={form.site_name_bn} onChange={(e) => setForm({ ...form, site_name_bn: e.target.value })} className="input" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">সাপোর্ট ইমেইল</span>
        <input
          type="email"
          value={form.support_email}
          onChange={(e) => setForm({ ...form, support_email: e.target.value })}
          className="input"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">সাপোর্ট ফোন নম্বর</span>
        <input value={form.support_phone} onChange={(e) => setForm({ ...form, support_phone: e.target.value })} className="input" />
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.maintenance_mode}
          onChange={(e) => setForm({ ...form, maintenance_mode: e.target.checked })}
          className="h-5 w-5"
        />
        <span className="font-medium">মেইনটেন্যান্স মোড</span>
      </label>
      {form.maintenance_mode && (
        <p className="text-xs" style={{ color: "var(--vermillion)" }}>
          নোট: এই টগলটা এখন শুধু ডেটাবেসে সংরক্ষণ হয়। সাইটে সত্যিকারের মেইনটেন্যান্স স্ক্রিন দেখাতে হলে আরেকটা
          ছোট কাজ লাগবে — middleware-এ এই ফ্ল্যাগ চেক করে redirect করা।
        </p>
      )}

      {message && <p className="text-sm">{message}</p>}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
      </button>
    </form>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs">{label}</span>
      <input
        type="number"
        step="0.5"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input"
      />
    </label>
  );
}
