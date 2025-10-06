import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SectionHeading } from "../lib/sections";

type MarkdownContentProps = {
  content: string;
  headings?: SectionHeading[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  headings,
}) => {
  const normalized = useMemo(() => content.replace(/\n{3,}/g, "\n\n"), [content]);
  const headingQueue = useMemo(() => headings ?? [], [headings]);
  let headingPointer = 0;

  const consumeHeadingId = (level: number, fallback: string) => {
    if (!headingQueue.length) return slugify(fallback);

    for (let index = headingPointer; index < headingQueue.length; index++) {
      const candidate = headingQueue[index];
      if (candidate.level === level) {
        headingPointer = index + 1;
        return candidate.id;
      }
    }

    return slugify(fallback);
  };

  return (
    <article className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, children, ...props }) => {
            const textContent = String(children);
            const id = consumeHeadingId(1, textContent);
            return (
              <h1 {...props} id={id} className="mdx-h1">
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const textContent = String(children);
            const id = consumeHeadingId(2, textContent);
            return (
              <h2 {...props} id={id} className="mdx-h2">
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const textContent = String(children);
            const id = consumeHeadingId(3, textContent);
            return (
              <h3 {...props} id={id} className="mdx-h3">
                {children}
              </h3>
            );
          },
          p: ({ node, ...props }) => (
            <p {...props} className="mdx-paragraph" />
          ),
          ul: ({ node, ordered, ...props }) => (
            <ul {...props} className="mdx-list" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="mdx-list-item" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="mdx-strong" />
          ),
          table: ({ node, ...props }) => (
            <div className="mdx-table-wrapper">
              <table {...props} />
            </div>
          ),
          code: ({ inline, node, className, children, ...props }) => {
            if (inline) {
              return (
                <code {...props} className="mdx-inline-code">
                  {children}
                </code>
              );
            }
            return (
              <pre className="mdx-code-block">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {normalized}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownContent;
