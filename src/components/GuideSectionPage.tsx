import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownContent from "./MarkdownContent";
import OutlinePanel from "./OutlinePanel";
import { useLayoutContext } from "./layout/LayoutContext";
import { getScrollContainer } from "../lib/utils";

interface SectionHeading {
  id: string;
  text: string;
  level: number;
}

const GuideSectionPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, setActiveSectionId } = useLayoutContext();

  const fallbackSection = sections[0];
  const resolvedId = sectionId ?? fallbackSection?.id;
  const section = useMemo(() => 
    sections.find((candidate) => candidate.id === resolvedId) || null,
    [sections, resolvedId]
  );

  useEffect(() => {
    if (!section && fallbackSection) {
      navigate("/", { replace: true });
    }
  }, [section, fallbackSection, navigate]);

  useEffect(() => {
    if (section?.id) {
      setActiveSectionId(section.id);
      const scrollContainer = getScrollContainer();
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [section, setActiveSectionId, location.key]);

  const { currentIndex, previousSection, nextSection } = useMemo(() => {
    const idx = section ? sections.findIndex(s => s.id === section.id) : -1;
    return {
      currentIndex: idx,
      previousSection: idx > 0 ? sections[idx - 1] : null,
      nextSection: idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null
    };
  }, [sections, section]);

  if (!section) {
    return (
      <div className="section-fallback">
        <h1>Section not found</h1>
        <p>Select another section from the navigation to continue.</p>
      </div>
    );
  }

  // Safely get section properties with fallbacks
  const sectionTitle = section.full_title || section.fullTitle || section.title || 'Untitled';
  const sectionSummary = section.summary || '';
  const readingTime = section.readingTimeMinutes ?? 5; // Default to 5 min if not specified
  const content = section.content || section.content_markdown || '';
  const headings: SectionHeading[] = section.headings || [];

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <span className="section-view__badge">Chapter</span>
          <h1 className="section-view__title">
            {sectionTitle}
          </h1>
          {sectionSummary && (
            <p className="section-view__summary">{sectionSummary}</p>
          )}
          <div className="section-view__meta">
            <span>≈ {readingTime} min read</span>
            <span>Updated in {new Date().getFullYear()}</span>
          </div>
        </div>
        
        <MarkdownContent 
          content={content} 
          headings={headings} 
        />
        
        <nav className="section-view__pagination" aria-label="Section navigation">
          {previousSection && (
            <Link
              to={previousSection.id === fallbackSection?.id ? "/" : `/guide/${previousSection.id}`}
              className="section-view__pagination-link section-view__pagination-link--prev"
            >
              <span className="section-view__pagination-label">Previous</span>
              <span className="section-view__pagination-title">
                {previousSection.title}
              </span>
            </Link>
          ) || (
            <span className="section-view__pagination-placeholder" />
          )}

          {nextSection && (
            <Link
              to={nextSection.id === fallbackSection?.id ? "/" : `/guide/${nextSection.id}`}
              className="section-view__pagination-link section-view__pagination-link--next"
            >
              <span className="section-view__pagination-label">Next</span>
              <span className="section-view__pagination-title">
                {nextSection.title}
              </span>
            </Link>
          ) || (
            <span className="section-view__pagination-placeholder" />
          )}
        </nav>
      </div>
      {headings.length > 0 && <OutlinePanel headings={headings} />}
    </div>
  );
};

export default GuideSectionPage;
