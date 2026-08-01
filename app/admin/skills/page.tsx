import { createClient } from "@/lib/supabase/server";
import SkillManager from "@/components/admin/SkillManager";

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const { data: skills } = await supabase.from("skill_categories").select("*").order("group_name").order("name_bn");

  return (
    <div>
      <h1 className="display text-2xl font-bold">স্কিল ক্যাটাগরি</h1>
      <p className="mt-1 text-sm" style={{ color: "#6b665c" }}>
        এই তালিকা থেকেই ওয়ার্কাররা তাদের সর্বোচ্চ ৫টি কাজের ধরন বাছাই করেন এবং বায়াররা জব পোস্ট করার সময় বেছে নেন।
      </p>
      <SkillManager initialSkills={skills ?? []} />
    </div>
  );
}
