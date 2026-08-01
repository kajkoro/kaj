import { createClient } from "@/lib/supabase/server";
import ContentManager from "@/components/admin/ContentManager";
import { DEFAULT_CONTENT, CONTENT_LABELS } from "@/lib/content";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const keys = Object.keys(DEFAULT_CONTENT);
  const { data } = await supabase.from("site_content").select("key, value").in("key", keys);

  const items = keys.map((key) => ({
    key,
    label: CONTENT_LABELS[key] ?? key,
    value: data?.find((d) => d.key === key)?.value ?? DEFAULT_CONTENT[key],
  }));

  return (
    <div>
      <h1 className="display text-2xl font-bold">পেজ কনটেন্ট</h1>
      <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
        হোমপেজ ও অন্যান্য পেজের লেখা এখান থেকে বদলাতে পারবেন — সেভ করলেই সাথে সাথে লাইভ সাইটে দেখা যাবে।
        &quot;## &quot; দিয়ে শুরু হওয়া লাইন হেডিং হিসেবে, আর &quot;- &quot; দিয়ে শুরু লাইন বুলেট পয়েন্ট হিসেবে দেখাবে।
      </p>
      <ContentManager items={items} />
    </div>
  );
}
