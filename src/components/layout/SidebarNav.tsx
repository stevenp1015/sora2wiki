import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLayoutContext } from "./LayoutContext";

const filterSections = (term: string, title: string, summary: string) => {
  if (!term.trim()) return true;
  const lowered = term.toLowerCase();
  return (
    title.toLowerCase().includes(lowered) ||
    summary.toLowerCase().includes(lowered)
  );
};

const SidebarNav: React.FC = () => {
  const { sections, searchTerm } = useLayoutContext();
  const location = useLocation();

  const filteredSections = useMemo(
    () =>
      sections.filter((section) =>
        filterSections(searchTerm, section.title, section.summary),
      ),
    [sections, searchTerm],
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
                const path = isRoot ? "/" : `/guide/${section.id}`;
                return (
                  <li key={section.id}>
                    <NavLink
                      to={path}
                      end={isRoot}
                      className={({ isActive }) =>
                        [
                          "wiki-sidebar__link",
                          isActive || location.pathname === path
                            ? "wiki-sidebar__link--active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")
                      }
                    >
                      <span className="wiki-sidebar__link-title">
                        {section.title}
                      </span>
                      <span className="wiki-sidebar__link-summary">
                        {section.summary}
                      </span>
                    </NavLink>
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
