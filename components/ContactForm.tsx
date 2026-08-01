"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("support_messages").insert(form);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-xl p-5 text-sm" style={{ background: "var(--paper)", border: "1px solid var(--leaf)" }}>
        ✓ আপনার মেসেজ পাঠানো হয়েছে। আমরা যত দ্রুত সম্ভব উত্তর দেব।
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">নাম</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">ইমেইল</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">বিষয়</span>
        <input
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">মেসেজ</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input"
        />
      </label>
      {error && <p className="text-sm" style={{ color: "var(--vermillion)" }}>{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "পাঠানো হচ্ছে..." : "পাঠান"}
      </button>
    </form>
  );
}
