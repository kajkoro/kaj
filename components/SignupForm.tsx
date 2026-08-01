"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // The profiles row is created automatically by a database trigger
    // (see supabase/migrations/003_auto_create_profile.sql) — no need
    // to insert it from the client, which avoids an RLS race condition
    // when email confirmation is required and there's no session yet.

    if (!data.session) {
      // Email confirmation is required — no active session yet.
      setError(null);
      setLoading(false);
      setConfirmationSent(true);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <h1 className="display text-3xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
      <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
        কাজ পোস্ট করতে অথবা কাজ খুঁজে আয় করতে — একটাই অ্যাকাউন্ট।
      </p>

      {confirmationSent ? (
        <div
          className="mt-8 rounded-xl p-5 text-sm"
          style={{ background: "var(--paper)", border: "1px solid var(--leaf)" }}
        >
          ✓ <strong>{email}</strong> এ একটা কনফার্মেশন ইমেইল পাঠানো হয়েছে। ইমেইলে থাকা লিংকে ক্লিক করে
          অ্যাকাউন্ট নিশ্চিত করুন, তারপর{" "}
          <Link href="/login" className="underline" style={{ color: "var(--cobalt)" }}>
            লগইন করুন
          </Link>
          ।
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="পূর্ণ নাম">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input"
            placeholder="যেমন: আফরিন সুলতানা"
          />
        </Field>
        <Field label="ইমেইল">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="পাসওয়ার্ড">
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </Field>

        {error && (
          <p className="text-sm" style={{ color: "var(--vermillion)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full py-3 font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--cobalt)" }}
        >
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--cobalt)" }}>
          লগইন করুন
        </Link>
      </p>
        </>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
