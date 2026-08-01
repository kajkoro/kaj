import { createClient } from "@/lib/supabase/server";
import SupportMessageRow from "@/components/admin/SupportMessageRow";

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="display text-2xl font-bold">সাপোর্ট মেসেজ</h1>
      <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
        কন্টাক্ট ও সাপোর্ট পেজ থেকে জমা হওয়া মেসেজ।
      </p>

      <div className="mt-6 space-y-3">
        {messages?.map((m) => (
          <SupportMessageRow key={m.id} message={m} />
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm" style={{ color: "#6b665c" }}>
            কোনো মেসেজ নেই।
          </p>
        )}
      </div>
    </div>
  );
}
