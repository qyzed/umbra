"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";

type Lang = "python" | "bash" | "text";

const PY_TOKEN =
  /("""[\s\S]*?"""|'''[\s\S]*?'''|#[^\n]*)|("[^"\n]*"|'[^'\n]*')|\b(async|await|def|class|return|import|from|if|elif|else|for|while|try|except|finally|with|as|not|and|or|in|is|None|True|False|raise|pass|lambda|global|del|print)\b|\b(\d+(?:\.\d+)?)\b/g;

function highlightPython(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(PY_TOKEN)) {
    const idx = match.index ?? 0;
    if (idx > last) {
      nodes.push(<span key={key++}>{code.slice(last, idx)}</span>);
    }
    const [full, comment, str, keyword, num] = match;
    let cls = "";
    if (comment) {
      cls = full.startsWith("#")
        ? "text-faint italic"
        : "text-steel/80 italic";
    } else if (str) {
      cls = "text-steel";
    } else if (keyword) {
      cls = "text-accent";
    } else if (num) {
      cls = "text-mist/70";
    }
    nodes.push(
      <span key={key++} className={cls}>
        {full}
      </span>,
    );
    last = idx + full.length;
  }
  if (last < code.length) {
    nodes.push(<span key={key++}>{code.slice(last)}</span>);
  }
  return nodes;
}

function highlightBash(code: string): ReactNode[] {
  return code.split("\n").flatMap((line, i) => {
    const isComment = line.trimStart().startsWith("#");
    return [
      <span key={i} className={isComment ? "text-faint italic" : undefined}>
        {line}
        {"\n"}
      </span>,
    ];
  });
}

export function CodeBlock({
  code,
  lang = "text",
  filename,
}: {
  code: string;
  lang?: Lang;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => {
    if (lang === "python") return highlightPython(code);
    if (lang === "bash") return highlightBash(code);
    return code;
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* молча */
    }
  };

  const lines = code.replace(/\n$/, "").split("\n").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#070a0c]">
      <div className="flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3">
        <FileCode2 className="h-4 w-4 text-steel" strokeWidth={1.7} />
        <span className="font-mono text-[12px] text-dim">{filename ?? "snippet"}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-faint">
          {lang} · {lines} строк
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] text-dim transition-colors hover:border-accent/35 hover:text-mist"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} /> готово
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" strokeWidth={1.7} /> копировать
            </>
          )}
        </button>
      </div>
      <div className="max-h-[560px] overflow-auto p-4">
        <pre className="flex font-mono text-[12.5px] leading-relaxed">
          <span className="sticky left-0 mr-4 select-none border-r border-line pr-4 text-right text-faint/50">
            {Array.from({ length: lines }, (_, i) => (
              <span key={i} className="block">
                {i + 1}
              </span>
            ))}
          </span>
          <code className="min-w-0 flex-1 whitespace-pre text-mist/85">{content}</code>
        </pre>
      </div>
    </div>
  );
}
