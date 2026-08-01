import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import MiniMarkdown from "@/components/MiniMarkdown";
import { getContent, getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("disclaimer");
  return { title: seo.title, description: seo.description };
}

export default async function DisclaimerPage() {
  const content = await getContent(["disclaimer_body"]);
  return (
    <LegalPage title="ডিসক্লেইমার" updated="৩১ জুলাই, ২০২৬">
      <MiniMarkdown text={content.disclaimer_body} />
    </LegalPage>
  );
}
