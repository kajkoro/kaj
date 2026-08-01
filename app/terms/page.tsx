import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import MiniMarkdown from "@/components/MiniMarkdown";
import { getContent, getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("terms");
  return { title: seo.title, description: seo.description };
}

export default async function TermsPage() {
  const content = await getContent(["terms_body"]);
  return (
    <LegalPage title="টার্মস অ্যান্ড কন্ডিশন" updated="৩১ জুলাই, ২০২৬">
      <MiniMarkdown text={content.terms_body} />
    </LegalPage>
  );
}
