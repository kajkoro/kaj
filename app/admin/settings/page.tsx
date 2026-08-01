import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").single();

  return (
    <div>
      <h1 className="display text-2xl font-bold">সাইট সেটিংস</h1>
      {settings ? (
        <SettingsForm initialSettings={settings} />
      ) : (
        <p className="mt-4 text-sm" style={{ color: "var(--vermillion)" }}>
          site_settings টেবিল পাওয়া যায়নি। migration_002 রান করা হয়েছে কিনা যাচাই করুন।
        </p>
      )}
    </div>
  );
}
