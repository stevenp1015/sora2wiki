import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLayoutContext } from "./LayoutContext";
import type { Category, Article } from "../../content/types";

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
  const location = useLocation();

  const filteredResults = useMemo(
    () => filterContent(searchTerm, wikiContent.categories),
    [searchTerm, wikiContent.categories]
  );

  return (
    <aside className="wiki-sidebar" aria-label="Wiki navigation">
      <div className="wiki-sidebar__inner">
        <p className="wiki-sidebar__lead">
          {wikiContent.wiki_title} - Navigate by category and article. Search
          filters content in real-time.
        </p>
        <nav className="wiki-sidebar__nav">
          {filteredResults.length === 0 ? (
            <div className="wiki-sidebar__empty">No content matches your search.</div>
          ) : (
            <ul className="wiki-sidebar__categories">
              {filteredResults.map(({ category, matchedArticles }) => {
                const isExpanded = expandedCategories.has(category.category_slug);
                const hasContent = matchedArticles.some(
                  (a) => a.content_markdown && a.content_markdown.length > 0
                );

                return (
                  <li key={category.category_slug} className="wiki-sidebar__category">
                    <button
                      onClick={() => toggleCategory(category.category_slug)}
                      className="wiki-sidebar__category-toggle"
                      aria-expanded={isExpanded}
                    >
                      <span className="wiki-sidebar__category-icon">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <span className="wiki-sidebar__category-title">
                        {category.category_title}
                      </span>
                      <span className="wiki-sidebar__category-count">
                        ({matchedArticles.length})
                      </span>
                    </button>

                    {isExpanded && (
                      <ul className="wiki-sidebar__articles">
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
