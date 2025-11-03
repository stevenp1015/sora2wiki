import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownContent from "../MarkdownContent";
import OutlinePanel from "../OutlinePanel";
import { contentService } from "../../services/contentService";
import { useSoraVersion } from "../../contexts/SoraVersionContext";
import VersionSwitcher from "../VersionSwitcher";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Section {
  id: string;
  title: string;
  full_title?: string;
  content: string;
  summary?: string;
  readingTimeMinutes?: number;
  headings: Heading[];
}

const GuideSectionPage: React.FC = () => {
  const { sectionId, articleSlug } = useParams<{ sectionId?: string; articleSlug?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { version } = useSoraVersion();
  
  const [section, setSection] = useState<Section | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = () => {
      try {
        setIsLoading(true);
        const content = contentService.getContent();
        
        // Transform categories and articles into sections
        const allSections: Section[] = [];
        
        content.categories.forEach((category: any) => {
          // Add the category as a section
          allSections.push({
            id: category.category_slug,
            title: category.category_title,
            full_title: category.category_title,
            content: `# ${category.category_title}\n\n${category.category_description}`,
            summary: category.category_description,
            readingTimeMinutes: Math.ceil(category.category_description.split(/\s+/).length / 200),
            headings: [
              {
                id: category.category_slug,
                text: category.category_title,
                level: 1
              }
            ]
          });

          // Add each article as a section
          category.articles.forEach((article: any) => {
            const articleId = `${category.category_slug}/${article.article_slug}`;
            allSections.push({
              id: articleId,
              title: article.article_title,
              full_title: article.article_title,
              content: article.content_markdown || `# ${article.article_title}\n\n${article.seo_description || 'Content coming soon.'}`,
              summary: article.seo_description,
              readingTimeMinutes: Math.ceil((article.content_markdown || '').split(/\s+/).length / 200) || 5,
              headings: extractHeadings(article.content_markdown || '')
            });
          });
        });

        setSections(allSections);
        
        // Find the current section based on URL params
        let currentSection: Section | undefined;
        
        if (articleSlug) {
          // If we have an article slug, find the specific article
          const articleId = `${sectionId}/${articleSlug}`;
          currentSection = allSections.find(s => s.id === articleId);
        } else if (sectionId) {
          // Otherwise, find the category
          currentSection = allSections.find(s => s.id === sectionId);
        }
        
        // If no section found and we have sections, default to the first one
        if (!currentSection && allSections.length > 0) {
          currentSection = allSections[0];
        }
        
        setSection(currentSection || null);
        setError(null);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [sectionId, articleSlug, version]);

  // Helper function to extract headings from markdown
  const extractHeadings = (markdown: string): Heading[] => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    let match;
    
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      
      headings.push({ id, text, level });
    }
    
    return headings;
  };

  if (isLoading) {
    return (
      <div className="section-view">
        <div className="section-view__content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-view">
        <div className="section-view__content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="section-view">
        <div className="section-view__content">
          <h1>Section not found</h1>
          <p>Select another section from the navigation to continue.</p>
        </div>
      </div>
    );
  }

  const currentIndex = sections.findIndex((candidate) => candidate.id === section.id);
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return (
    <div className="section-view">
      <div className="section-view__content">
        <VersionSwitcher />
        
        <div className="section-view__intro">
          <span className="section-view__badge">
            {sectionId && articleSlug ? 'Article' : 'Category'}
          </span>
          <h1 className="section-view__title">
            {section.full_title || section.title}
          </h1>
          {section.summary && (
            <p className="section-view__summary">{section.summary}</p>
          )}
          <div className="section-view__meta">
            <span>≈ {section.readingTimeMinutes || 5} min read</span>
            <span>Updated in {new Date().getFullYear()}</span>
          </div>
        </div>
        
        <MarkdownContent content={section.content} headings={section.headings} />
        
        <nav className="section-view__pagination" aria-label="Section navigation">
          {previousSection ? (
            <Link
              to={`/guide/${previousSection.id}`}
              className="section-view__pagination-link section-view__pagination-link--prev"
            >
              <span className="section-view__pagination-label">Previous</span>
              <span className="section-view__pagination-title">
                {previousSection.title}
              </span>
            </Link>
          ) : (
            <span className="section-view__pagination-placeholder" />
          )}

          {nextSection ? (
            <Link
              to={`/guide/${nextSection.id}`}
              className="section-view__pagination-link section-view__pagination-link--next"
            >
              <span className="section-view__pagination-label">Next</span>
              <span className="section-view__pagination-title">
                {nextSection.title}
              </span>
            </Link>
          ) : (
            <span className="section-view__pagination-placeholder" />
          )}
        </nav>
      </div>
      
      {section.headings && section.headings.length > 0 && (
        <OutlinePanel headings={section.headings} />
      )}
    </div>
  );
};

export default GuideSectionPage;
