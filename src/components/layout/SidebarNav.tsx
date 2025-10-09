import React, { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useLayoutContext } from "./LayoutContext";
import type { GuidePage, GuideSection } from "../../lib/sections";

const filterItems = (
  term: string,
  sections: GuideSection[],
): GuideSection[] => {
  if (!term.trim()) return sections;

  const lowered = term.toLowerCase();

  return sections
    .map((section) => {
      const matchingPages = section.pages.filter(
        (page) =>
          page.title.toLowerCase().includes(lowered) ||
          page.summary.toLowerCase().includes(lowered),
      );

      if (matchingPages.length > 0) {
        return { ...section, pages: matchingPages };
      }
      return null;
    })
    .filter((section): section is GuideSection => section !== null);
};

const SidebarNav: React.FC = () => {
  const { sections, searchTerm } = useLayoutContext();
  const { sectionId: activeSectionId } = useParams<{ sectionId: string }>();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const isSectionOpen = (section: GuideSection) => {
    return openSections[section.id] || activeSectionId === section.id;
  };

  const filteredSections = useMemo(
    () => filterItems(searchTerm, sections),
    [searchTerm, sections],
  );

  return (
    <aside className="wiki-sidebar" aria-label="Section navigation">
      <div className="wiki-sidebar__inner">
        <p className="wiki-sidebar__lead">
          Explore the complete operating stack for Sora and advanced text-to-video
          prompting. Filters update live as you type.
        </p>
        <nav className="wiki-sidebar__nav">
          {filteredSections.length === 0 ? (
            <div className="wiki-sidebar__empty">No sections match that query.</div>
          ) : (
            <ul>
              {filteredSections.map((section) => {
                const isRoot = section.id === sections[0]?.id;
                const path = isRoot ? "/" : `/guide/${section.id}/${section.pages[0].id}`;

                return (
                  <li key={section.id} className="wiki-sidebar__section">
                    <div
                      className="wiki-sidebar__section-header"
                      onClick={() => toggleSection(section.id)}
                    >
                      <NavLink to={path} end={isRoot}>
                        {section.title}
                      </NavLink>
                    </div>
                    {isSectionOpen(section) && (
                      <ul className="wiki-sidebar__page-list">
                        {section.pages.map((page) => (
                          <li key={page.id}>
                            <NavLink
                              to={`/guide/${section.id}/${page.id}`}
                              className={({ isActive }) =>
                                `wiki-sidebar__link ${isActive ? "wiki-sidebar__link--active" : ""}`
                              }
                            >
                              <span className="wiki-sidebar__link-title">
                                {page.title}
                              </span>
                              <span className="wiki-sidebar__link-summary">
                                {page.summary}
                              </span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarNav;