import { SoraContent, SoraVersion } from '../types/content';

// Import Sora 2 content
import sora2Content from '../../sora-articles.json';

// Import Sora 1 content (placeholder - we'll update this later)
import sora1Content from '../lib/guideContent.json';

class ContentService {
  private static instance: ContentService;
  private currentVersion: SoraVersion = 'sora2';
  private content: Record<SoraVersion, any> = {
    sora1: sora1Content,
    sora2: sora2Content,
  };

  private constructor() {}

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  public setVersion(version: SoraVersion): void {
    this.currentVersion = version;
  }

  public getVersion(): SoraVersion {
    return this.currentVersion;
  }

  public getContent(): any {
    return this.content[this.currentVersion];
  }

  public getCategories(): any[] {
    return this.content[this.currentVersion].categories || [];
  }

  public getArticle(categorySlug: string, articleSlug: string): any {
    const category = this.content[this.currentVersion].categories.find(
      (cat: any) => cat.category_slug === categorySlug
    );
    
    if (!category) return null;
    
    return category.articles.find(
      (article: any) => article.article_slug === articleSlug
    ) || null;
  }

  public getCategory(categorySlug: string): any {
    return this.content[this.currentVersion].categories.find(
      (cat: any) => cat.category_slug === categorySlug
    ) || null;
  }
}

export const contentService = ContentService.getInstance();
