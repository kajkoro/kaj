export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent, getSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("contact");
  return { title: seo.title, description: seo.description };
}

export default async function ContactPage() {
  const content = await getContent(["contact_intro"]);
  return (
    <section className="mx-auto max-w-lg px-5 py-14">
      <h1 className="display text-3xl font-bold">যোগাযোগ করুন</h1>
      <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
        {content.contact_intro}
      </p>
      <ContactForm />
    </section>
  );
}
