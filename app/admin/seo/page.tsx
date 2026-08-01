import { createClient } from "@/lib/supabase/server";
import SeoManager from "@/components/admin/SeoManager";
import { DEFAULT_SEO } from "@/lib/content";

export default async function AdminSeoPage() {
  const supabase = await createClient();
  const pageKeys = Object.keys(DEFAULT_SEO);
  const { data } = await supabase.from("page_seo").select("*").in("page_key", pageKeys);

  const items = pageKeys.map((page_key) => {
    const existing = data?.find((d) => d.page_key === page_key);
    return {
      page_key,
      title: existing?.title || DEFAULT_SEO[page_key].title,
      description: existing?.description || DEFAULT_SEO[page_key].description,
    };
  });

  return (
    <div>
      <h1 className="display text-2xl font-bold">এসইও সেটিংস</h1>
      <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
        প্রতিটি পেজের মেটা টাইটেল ও ডেসক্রিপশন — গুগল সার্চ রেজাল্টে এভাবেই দেখাবে।
      </p>
      <SeoManager items={items} />
    </div>
  );
}
