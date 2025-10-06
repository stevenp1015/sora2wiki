import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownContent from "./MarkdownContent";
import OutlinePanel from "./OutlinePanel";
import { useLayoutContext } from "./layout/LayoutContext";

const GuideSectionPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, setActiveSectionId } = useLayoutContext();

  const fallbackSection = sections[0];
  const resolvedId = sectionId ?? fallbackSection?.id;
  const section = sections.find((candidate) => candidate.id === resolvedId);

  useEffect(() => {
    if (!section && fallbackSection) {
      navigate("/", { replace: true });
    }
  }, [section, fallbackSection, navigate]);

  useEffect(() => {
    if (section) {
      setActiveSectionId(section.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [section, setActiveSectionId, location.key]);

  if (!section) {
    return (
      <div className="section-fallback">
        <h1>Section not found</h1>
        <p>Select another section from the navigation to continue.</p>
      </div>
    );
  }

  const currentIndex = sections.findIndex((candidate) => candidate.id === section.id);
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const nextSection =
    currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <span className="section-view__badge">Chapter</span>
          <h1 className="section-view__title">
            {section.fullTitle ?? section.title}
          </h1>
          <p className="section-view__summary">{section.summary}</p>
          <div className="section-view__meta">
            <span>≈ {section.readingTimeMinutes} min read</span>
            <span>Updated in {new Date().getFullYear()}</span>
          </div>
        </div>
        <MarkdownContent content={section.content} headings={section.headings} />
        <nav className="section-view__pagination" aria-label="Section pagination">
          {previousSection ? (
            <Link
              to={previousSection.id === fallbackSection?.id ? "/" : `/guide/${previousSection.id}`}
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
              to={nextSection.id === fallbackSection?.id ? "/" : `/guide/${nextSection.id}`}
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
      <OutlinePanel headings={section.headings} />
    </div>
  );
};

export default GuideSectionPage;
