import React, { useMemo } from "react";
// We are using NavLink, but we are going to COMPLETELY control the styling.
import { NavLink, useLocation, useParams } from "react-router-dom";
import { NavItem } from "./AppLayout";

// --- Design System Implementation ---
// These are the styles for the "Contextual Row"
// I am defining them here as constants to show the logic.

// The base styles for the NavLink (the "Contextual Row")
const navLinkBase = `
  group relative block w-full rounded-md py-2 pl-6 pr-4
  transition-colors duration-150
  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background
`;

// The styles for an INACTIVE link (default + hover state)
const navLinkInactive = `
  hover:bg-muted
`;

// The styles for an ACTIVE link (the "permanent" state)
const navLinkActive = `
  bg-muted
`;

// --- End Design System ---

interface SidebarNavProps {
  navItems: NavItem[];
  searchTerm?: string;
  onNavigate?: () => void;
}

// Filter function is pure logic, it stays. It's good.
const filterItems = (term: string, item: NavItem): boolean => {
  if (!term.trim()) return true;
  const lowered = term.toLowerCase();
  const textToSearch = [
    item.title,
    item.full_title || item.fullTitle,
    item.description,
    item.summary,
    item.article_title,
    item.category_title,
    item.seo_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return textToSearch.includes(lowered);
};

const SidebarNav: React.FC<SidebarNavProps> = ({
  navItems,
  searchTerm = "",
  onNavigate,
}) => {
  const location = useLocation();
  const params = useParams<{ category?: string; article?: string }>();

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return navItems;
    return navItems.filter((item) => filterItems(searchTerm, item));
  }, [navItems, searchTerm]);

  const renderNavItem = (item: NavItem, level = 0) => {
    // --- THIS IS THE CATEGORY HEADER ---
    // It's not a link, it's a *label*. It needs hierarchy.
    if (item.items && item.items.length > 0) {
      return (
        <li key={item.id} className="mt-4 first:mt-0">
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {item.category_title || item.title}
          </div>
          {/* The list of children. I'm adding `gap-1` for spacing. */}
          <ul className="flex flex-col gap-1 px-4 mt-1">
            {item.items.map((child) => renderNavItem(child, level + 1))}
          </ul>
        </li>
      );
    }

    // --- THIS IS THE "CONTEXTUAL ROW" ---
    // This is the article, the link. This is the *entire* system.

    // Logic for path and active state is fine.
    const path =
      item.path ||
      (item.article_slug && item.category_slug
        ? `/${item.category_slug}/${item.article_slug}`
        : `/${item.id}`);

    // We need this to pass down.
    const isActive =
      location.pathname === path ||
      params.article === item.article_slug ||
      (params.category === item.category_slug && !params.article);

    // This is the description I was talking about.
    const description =
      item.description || item.summary || item.seo_description;

    return (
      <li key={item.id}>
        <NavLink
          to={path}
          onClick={onNavigate}
          // HERE. This is it.
          // We use NavLink's render prop to merge *its* active state with *ours*.
          className={({ isActive: isNavActive }) =>
            [
              navLinkBase,
              isActive || isNavActive ? navLinkActive : navLinkInactive,
            ].join(" ")
          }
        >
          {/* THIS IS THE "INDICATOR". 
            The *refined* one. The `opacity` fade. No "wipes".
            It's positioned `absolute left-0`. The parent `NavLink` has `pl-6`.
          */}
          <div
            className={`
              absolute left-0 top-[6px] bottom-[6px] w-[2px] bg-primary
              transition-opacity duration-150
              ${
                isActive
                  ? "opacity-100" // *Always* on for the active link
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" // Fades in
              }
            `}
            aria-hidden="true"
          />

          {/* THIS IS THE TEXT. 
            The title (`text-foreground`) and the description (`text-muted-foreground`).
          */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {item.article_title || item.title}
            </span>
            {/* AND THIS IS THE "CLARIFYING" DESCRIPTION.
              It animates to `text-foreground` on hover/focus/active.
            */}
            {description && (
              <span
                className={`
                text-xs text-muted-foreground
                transition-colors duration-150
                ${
                  isActive
                    ? "text-foreground" // Active description is *always* clear
                    : "group-hover:text-foreground group-focus-visible:text-foreground"
                }
              `}
              >
                {description}
              </span>
            )}
          </div>
        </NavLink>
      </li>
    );
  };

  return (
    // --- STYLING THE WRAPPER ---
    // The `aside` itself needs the system's styling.
    <aside
      className="w-72 flex-shrink-0 border-r border-border bg-background"
      aria-label="Navigation"
    >
      {/* A `div` for the padding, so the scrollbar is at the edge. */}
      <div className="h-full p-4 overflow-y-auto">
        {/* The lead text. This is a *perfect* use for `muted-foreground`. */}
        <p className="px-4 text-sm text-muted-foreground">
          {searchTerm
            ? "Search results"
            : "Explore the complete guide to Sora and advanced text-to-video prompting."}
        </p>
        <nav className="mt-4">
          {filteredItems.length === 0 ? (
            <div className="px-4 text-sm text-muted-foreground">
              {searchTerm
                ? "No items match your search."
                : "No navigation items available."}
            </div>
          ) : (
            // The `ul` needs to be reset and spaced.
            <ul className="flex flex-col list-none p-0 m-0">
              {filteredItems.map((item) => renderNavItem(item))}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarNav;
