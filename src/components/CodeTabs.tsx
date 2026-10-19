"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/CodeBlock";

export interface CodeFile {
  label: string;
  filename: string;
  lang: "python" | "bash" | "text";
  code: string;
}

export function CodeTabs({ files }: { files: CodeFile[] }) {
  const [active, setActive] = useState(0);
  const file = files[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {files.map((f, i) => (
          <button
            key={f.filename}
            onClick={() => setActive(i)}
            className={`relative rounded-xl border px-4 py-2 font-mono text-[12px] transition-all duration-300 ${
              active === i
                ? "border-accent/35 bg-accent-deep/50 text-accent"
                : "border-line bg-surface/60 text-faint hover:text-dim"
            }`}
          >
            {f.label}
            {active === i && (
              <motion.span
                layoutId="code-tab-glow"
                className="absolute inset-x-3 -bottom-px h-px bg-accent"
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <CodeBlock code={file.code} lang={file.lang} filename={file.filename} />
      </div>
    </div>
  );
}
