export const dynamic = "force-dynamic";

import ContactForm from "@/components/ContactForm";

export const metadata = { title: "যোগাযোগ | কাজকরো" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-lg px-5 py-14">
      <h1 className="display text-3xl font-bold">যোগাযোগ করুন</h1>
      <p className="mt-2 text-sm" style={{ color: "#6b665c" }}>
        প্রশ্ন, অভিযোগ, বা পরামর্শ — যেকোনো কিছু জানাতে নিচের ফর্ম পূরণ করুন।
      </p>
      <ContactForm />
    </section>
  );
}
