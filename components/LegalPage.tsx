export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-14">
      <h1 className="display text-3xl font-bold">{title}</h1>
      {updated && (
        <p className="mt-1 text-xs" style={{ color: "#8a8478" }}>
          সর্বশেষ আপডেট: {updated}
        </p>
      )}
      <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed" style={{ color: "#3a362f" }}>
        {children}
      </div>
    </section>
  );
}
