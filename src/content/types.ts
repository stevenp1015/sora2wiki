// Sora 2 Wiki Content Types

export interface SectionHeading {
  id: string;
  level: number;
  text: string;
}

export interface Article {
  article_title: string;
  article_slug: string;
  seo_description: string;
  content_markdown: string;
  // Auto-generated fields
  summary?: string;
  readingTimeMinutes?: number;
  headings?: SectionHeading[];
}

export interface Category {
  category_title: string;
  category_slug: string;
  category_description: string;
  articles: Article[];
}

export interface WikiContent {
  wiki_title: string;
  categories: Category[];
}

// Navigation helper types
export interface ArticleWithCategory extends Article {
  categorySlug: string;
  categoryTitle: string;
}

export interface CategorySummary {
  category_title: string;
  category_slug: string;
  category_description: string;
  articleCount: number;
  filledArticleCount: number;
}
