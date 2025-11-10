import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import MarkdownContent from '../components/MarkdownContent';
import OutlinePanel from '../components/OutlinePanel';
import { findArticle, wikiContent } from '../content';
import { getScrollContainer } from '../lib/utils';

const ArticlePage: React.FC = () => {
  const { categorySlug, articleSlug } = useParams<{
    categorySlug: string;
    articleSlug: string;
  }>();

  if (!categorySlug || !articleSlug) {
    return <Navigate to="/" replace />;
  }

  const result = findArticle(wikiContent, categorySlug, articleSlug);

  useEffect(() => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [categorySlug, articleSlug]);

  if (!result) {
    return (
      <div className="section-view">
        <div className="section-view__content">
          <div className="section-fallback">
            <h1>Article not found</h1>
            <p>
              <Link to="/">Return to home</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { article, category } = result;

  // Find previous/next articles in the same category
  const currentIndex = category.articles.findIndex(
    (a) => a.article_slug === articleSlug
  );
  const previousArticle =
    currentIndex > 0 ? category.articles[currentIndex - 1] : undefined;
  const nextArticle =
    currentIndex < category.articles.length - 1
      ? category.articles[currentIndex + 1]
      : undefined;

  const hasContent = article.content_markdown && article.content_markdown.length > 0;

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <div className="section-view__breadcrumbs">
            <Link to="/">Home</Link>
            <span> / </span>
            <Link to={`/${categorySlug}`}>{category.category_title}</Link>
          </div>
          <span className="section-view__badge">Article</span>
          <h1 className="section-view__title">{article.article_title}</h1>
          <p className="section-view__summary">{article.seo_description}</p>
          {hasContent && article.readingTimeMinutes && article.readingTimeMinutes > 0 && (
            <div className="section-view__meta">
              <span>≈ {article.readingTimeMinutes} min read</span>
              <span>Updated in {new Date().getFullYear()}</span>
            </div>
          )}
        </div>

        {hasContent ? (
          <>
            <MarkdownContent
              content={article.content_markdown}
              headings={article.headings || []}
            />
            <nav
              className="section-view__pagination"
              aria-label="Article pagination"
            >
              {previousArticle ? (
                <Link
                  to={`/${categorySlug}/${previousArticle.article_slug}`}
                  className="section-view__pagination-link section-view__pagination-link--prev"
                >
                  <span className="section-view__pagination-label">Previous</span>
                  <span className="section-view__pagination-title">
                    {previousArticle.article_title}
                  </span>
                </Link>
              ) : (
                <span className="section-view__pagination-placeholder" />
              )}

              {nextArticle ? (
                <Link
                  to={`/${categorySlug}/${nextArticle.article_slug}`}
                  className="section-view__pagination-link section-view__pagination-link--next"
                >
                  <span className="section-view__pagination-label">Next</span>
                  <span className="section-view__pagination-title">
                    {nextArticle.article_title}
                  </span>
                </Link>
              ) : (
                <span className="section-view__pagination-placeholder" />
              )}
            </nav>
          </>
        ) : (
          <div className="section-fallback">
            <h2>Content Coming Soon</h2>
            <p>This article is currently being written. Check back soon!</p>
            <Link to={`/${categorySlug}`}>← Back to {category.category_title}</Link>
          </div>
        )}
      </div>
      {hasContent && article.headings && article.headings.length > 0 && (
        <OutlinePanel headings={article.headings} />
      )}
    </div>
  );
};

export default ArticlePage;
