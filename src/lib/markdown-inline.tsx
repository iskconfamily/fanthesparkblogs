import type { ReactNode } from "react";

/**
 * Render text containing inline markdown links (`[text](url)`), bold (`**x**`),
 * and italics (`*x*` or `_x_`) as safe JSX. URLs are validated; only http(s)
 * and mailto are allowed. Never uses dangerouslySetInnerHTML.
 *
 * Supports bare http(s) URLs too — they're auto-linked.
 */
export function renderInline(text: string): ReactNode[] {
  if (!text) return [];
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  // Combined regex: [text](url) | **bold** | *em* | _em_ | bare http(s) url
  const re =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|(https?:\/\/[^\s<>()]+)/g;

  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) nodes.push(text.slice(i, m.index));
    if (m[1] && m[2]) {
      nodes.push(
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          {m[1]}
        </a>,
      );
    } else if (m[3]) {
      nodes.push(<strong key={key++}>{m[3]}</strong>);
    } else if (m[4]) {
      nodes.push(<em key={key++}>{m[4]}</em>);
    } else if (m[5]) {
      nodes.push(<em key={key++}>{m[5]}</em>);
    } else if (m[6]) {
      nodes.push(
        <a
          key={key++}
          href={m[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary break-words"
        >
          {m[6]}
        </a>,
      );
    }
    i = m.index + m[0].length;
  }
  if (i < text.length) nodes.push(text.slice(i));
  return nodes;
}
