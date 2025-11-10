import React from 'react';
import { Link } from 'react-router-dom';
import { wikiContent } from '../content';
import type { CategorySummary } from '../content/types';

const HomePage: React.FC = () => {
  const categorySummaries: CategorySummary[] = wikiContent.categories.map(
    (category) => ({
      category_title: category.category_title,
      category_slug: category.category_slug,
      category_description: category.category_description,
      articleCount: category.articles.length,
      filledArticleCount: category.articles.filter(
        (a) => a.content_markdown && a.content_markdown.length > 0
      ).length,
    })
  );

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <span className="section-view__badge">Welcome</span>
          <h1 className="section-view__title">{wikiContent.wiki_title}</h1>
          <p className="section-view__summary">
            Your comprehensive resource for mastering Sora 2, the cutting-edge
            text-to-video AI model. Explore categories below to dive into
            specific topics.
          </p>
        </div>

        <div className="category-grid">
          {categorySummaries.map((category) => (
            <Link
              key={category.category_slug}
              to={`/${category.category_slug}`}
              className="category-card"
            >
              <h2 className="category-card__title">{category.category_title}</h2>
              <p className="category-card__description">
                {category.category_description}
              </p>
              <div className="category-card__meta">
                <span>
                  {category.filledArticleCount} of {category.articleCount}{' '}
                  articles
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
