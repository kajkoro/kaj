import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import MiniMarkdown from "@/components/MiniMarkdown";
import { getContent, getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("privacy");
  return { title: seo.title, description: seo.description };
}

export default async function PrivacyPage() {
  const content = await getContent(["privacy_body"]);
  return (
    <LegalPage title="প্রাইভেসি পলিসি" updated="৩১ জুলাই, ২০২৬">
      <MiniMarkdown text={content.privacy_body} />
    </LegalPage>
  );
}
