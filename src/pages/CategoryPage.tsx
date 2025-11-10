import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { findCategory } from '../content';
import { wikiContent } from '../content';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  if (!categorySlug) {
    return <Navigate to="/" replace />;
  }

  const category = findCategory(wikiContent, categorySlug);

  if (!category) {
    return (
      <div className="section-view">
        <div className="section-view__content">
          <div className="section-fallback">
            <h1>Category not found</h1>
            <p>
              <Link to="/">Return to home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filledArticles = category.articles.filter(
    (a) => a.content_markdown && a.content_markdown.length > 0
  );

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <Link to="/" className="section-view__breadcrumb">
            ← Back to categories
          </Link>
          <span className="section-view__badge">Category</span>
          <h1 className="section-view__title">{category.category_title}</h1>
          <p className="section-view__summary">{category.category_description}</p>
          <div className="section-view__meta">
            <span>
              {filledArticles.length} of {category.articles.length} articles
              available
            </span>
          </div>
        </div>

        <div className="article-list">
          {category.articles.map((article) => {
            const hasContent =
              article.content_markdown && article.content_markdown.length > 0;

            return (
              <div key={article.article_slug} className="article-list-item">
                {hasContent ? (
                  <Link
                    to={`/${categorySlug}/${article.article_slug}`}
                    className="article-list-item__link"
                  >
                    <h2 className="article-list-item__title">
                      {article.article_title}
                    </h2>
                    <p className="article-list-item__description">
                      {article.seo_description}
                    </p>
                    {article.readingTimeMinutes && article.readingTimeMinutes > 0 && (
                      <span className="article-list-item__meta">
                        ≈ {article.readingTimeMinutes} min read
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="article-list-item__placeholder">
                    <h2 className="article-list-item__title">
                      {article.article_title}
                      <span className="article-list-item__badge">Coming Soon</span>
                    </h2>
                    <p className="article-list-item__description">
                      {article.seo_description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
