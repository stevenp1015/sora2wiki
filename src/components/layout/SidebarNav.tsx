import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLayoutContext } from "./LayoutContext";
import type { Category, Article } from "../../content/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../lib/ui/accordion";

interface FilterResult {
  category: Category;
  matchedArticles: Article[];
}

const filterContent = (
  term: string,
  categories: Category[]
): FilterResult[] => {
  if (!term.trim()) {
    return categories.map((category) => ({
      category,
      matchedArticles: category.articles,
    }));
  }

  const lowered = term.toLowerCase();
  return categories
    .map((category) => {
      const categoryMatches = category.category_title
        .toLowerCase()
        .includes(lowered);

      const matchedArticles = category.articles.filter(
        (article) =>
          categoryMatches ||
          article.article_title.toLowerCase().includes(lowered) ||
          article.seo_description.toLowerCase().includes(lowered)
      );

      return { category, matchedArticles };
    })
    .filter((result) => result.matchedArticles.length > 0);
};

const SidebarNav: React.FC = () => {
  const { wikiContent, searchTerm, expandedCategories, toggleCategory } =
    useLayoutContext();

  const filteredResults = useMemo(
    () => filterContent(searchTerm, wikiContent.categories),
    [searchTerm, wikiContent.categories]
  );

  const expandedValues = Array.from(expandedCategories);

  const handleValueChange = (values: string[]) => {
    const newSet = new Set(values);
    const current = expandedCategories;

    // Find what changed
    const added = values.find(v => !current.has(v));
    const removed = Array.from(current).find(v => !values.includes(v));

    if (added) toggleCategory(added);
    if (removed) toggleCategory(removed);
  };

  return (
    <aside className="wiki-sidebar" aria-label="Wiki navigation">
      <div className="wiki-sidebar__inner">
        <p className="wiki-sidebar__lead">
          {wikiContent.wiki_title}
        </p>
        <nav className="wiki-sidebar__nav">
          {filteredResults.length === 0 ? (
            <div className="wiki-sidebar__empty">No content matches your search.</div>
          ) : (
            <Accordion
              type="multiple"
              value={expandedValues}
              onValueChange={handleValueChange}
              className="wiki-sidebar__categories"
            >
              {filteredResults.map(({ category, matchedArticles }) => (
                <AccordionItem
                  key={category.category_slug}
                  value={category.category_slug}
                  className="wiki-sidebar__category"
                >
                  <AccordionTrigger className="wiki-sidebar__category-toggle">
                    <span className="wiki-sidebar__category-title">
                      {category.category_title}
                    </span>
                    <span className="wiki-sidebar__category-count">
                      ({matchedArticles.length})
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="wiki-sidebar__articles">
                    <ul className="wiki-sidebar__articles-list">
                      {matchedArticles.map((article) => {
                        const hasArticleContent =
                          article.content_markdown &&
                          article.content_markdown.length > 0;
                        const path = `/${category.category_slug}/${article.article_slug}`;

                        return (
                          <li key={article.article_slug}>
                            {hasArticleContent ? (
                              <NavLink
                                to={path}
                                className={({ isActive }) =>
                                  [
                                    "wiki-sidebar__article-link",
                                    isActive ? "wiki-sidebar__article-link--active" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")
                                }
                              >
                                {article.article_title}
                              </NavLink>
                            ) : (
                              <span className="wiki-sidebar__article-placeholder">
                                {article.article_title}
                                <span className="wiki-sidebar__article-badge">
                                  Soon
                                </span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarNav;
