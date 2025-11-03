export interface Article {
  article_title: string;
  article_slug: string;
  seo_description: string;
  content_markdown: string;
}

export interface Category {
  category_title: string;
  category_slug: string;
  category_description: string;
  articles: Article[];
}

export interface SoraContent {
  wiki_title: string;
  categories: Category[];
}

export type SoraVersion = 'sora1' | 'sora2';
