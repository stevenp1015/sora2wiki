import React, { useEffect, useMemo, useState } from "react";
import type { SectionHeading } from "../lib/sections";

type OutlinePanelProps = {
  headings: SectionHeading[];
};

const OutlinePanel: React.FC<OutlinePanelProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  const headingIds = useMemo(() => headings.map((heading) => heading.id), [
    headings,
  ]);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
          return;
        }

        const firstHeading = document.getElementById(headings[0].id);
        if (firstHeading && window.scrollY < firstHeading.offsetTop) {
          setActiveId(headings[0].id);
        }
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings, headingIds]);

  if (!headings.length) return null;

  return (
    <aside className="outline-panel" aria-label="In-page navigation">
      <h2 className="outline-panel__title">Outline</h2>
      <ul className="outline-panel__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={[
              "outline-panel__item",
              `outline-panel__item--level-${heading.level}`,
              heading.id === activeId ? "outline-panel__item--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <a href={`#${heading.id}`} className="outline-panel__link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default OutlinePanel;
