import { parseMiniMarkdown } from "@/lib/content";

export default function MiniMarkdown({ text }: { text: string }) {
  const blocks = parseMiniMarkdown(text);
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return (
            <h2 key={i} className="display text-lg font-bold">
              {b.content as string}
            </h2>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {(b.content as string[]).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b.content as string}</p>;
      })}
    </>
  );
}
