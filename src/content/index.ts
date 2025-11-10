import rawWikiContent from './sora-v2.json';
import { processWikiContent } from './processor';
import type { WikiContent } from './types';

// Process and export the wiki content
export const wikiContent: WikiContent = processWikiContent(
  rawWikiContent as WikiContent
);

// Re-export utilities
export {
  findArticle,
  findCategory,
  getAllArticles,
  processArticle,
} from './processor';

// Re-export types
export type {
  Article,
  Category,
  WikiContent,
  SectionHeading,
  ArticleWithCategory,
  CategorySummary,
} from './types';
