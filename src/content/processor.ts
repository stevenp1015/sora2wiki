import type { Article, SectionHeading, WikiContent, Category } from './types';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const toPlainText = (content: string) =>
  content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/^>+\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*([-*+]|(\d+\.))\s+/gm, '')
    .replace(/(\*{1,3}|_{1,3})(\S.*?\S?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

const estimateReadingTime = (plainText: string) => {
  const words = plainText.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 200));
};

const createSummary = (plainText: string) => {
  if (!plainText || plainText.length === 0) {
    return 'No content available yet.';
  }

  const sentences = plainText
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/);

  const firstMeaningful = sentences.find((sentence) => sentence.length > 40);
  const summary = firstMeaningful ?? sentences.slice(0, 2).join(' ');
  return summary.trim() || 'No content available yet.';
};

const extractHeadings = (content: string): SectionHeading[] => {
  if (!content || content.length === 0) return [];

  const lines = content.split('\n');
  const headings: SectionHeading[] = [];

  for (const line of lines) {
    const headingMatch = /^(#{1,3})\s+(.*)/.exec(line.trim());
    if (!headingMatch) continue;

    const [, hashes, headingText] = headingMatch;
    const level = hashes.length;
    const cleanText = toPlainText(headingText);
    const id = slugify(cleanText || headingText);
    headings.push({ id, level, text: cleanText });
  }

  return headings;
};

export const processArticle = (article: Article): Article => {
  const plainText = toPlainText(article.content_markdown || '');

  return {
    ...article,
    summary: createSummary(plainText),
    readingTimeMinutes: article.content_markdown ? estimateReadingTime(plainText) : 0,
    headings: extractHeadings(article.content_markdown || ''),
  };
};

export const processWikiContent = (rawContent: WikiContent): WikiContent => {
  return {
    ...rawContent,
    categories: rawContent.categories.map((category) => ({
      ...category,
      articles: category.articles.map(processArticle),
    })),
  };
};

// Helper to find article by slugs
export const findArticle = (
  wikiContent: WikiContent,
  categorySlug: string,
  articleSlug: string
): { article: Article; category: Category } | null => {
  const category = wikiContent.categories.find(
    (cat) => cat.category_slug === categorySlug
  );

  if (!category) return null;

  const article = category.articles.find(
    (art) => art.article_slug === articleSlug
  );

  if (!article) return null;

  return { article, category };
};

// Helper to get all articles (flattened)
export const getAllArticles = (wikiContent: WikiContent) => {
  return wikiContent.categories.flatMap((category) =>
    category.articles.map((article) => ({
      ...article,
      categorySlug: category.category_slug,
      categoryTitle: category.category_title,
    }))
  );
};

// Helper to get category by slug
export const findCategory = (
  wikiContent: WikiContent,
  categorySlug: string
): Category | null => {
  return wikiContent.categories.find(
    (cat) => cat.category_slug === categorySlug
  ) || null;
};
