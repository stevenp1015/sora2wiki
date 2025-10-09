import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownContent from "./MarkdownContent";
import OutlinePanel from "./OutlinePanel";
import { useLayoutContext } from "./layout/LayoutContext";

const GuideSectionPage: React.FC = () => {
  const { sectionId, pageId } = useParams<{ sectionId: string; pageId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { sections, setActiveSectionId } = useLayoutContext();

  const { section, page, pageIndex, sectionIndex } = useMemo(() => {
    const fallbackSection = sections[0];
    const resolvedSectionId = sectionId ?? fallbackSection?.id;
    const currentSection = sections.find((s) => s.id === resolvedSectionId);

    if (!currentSection) {
      return { section: undefined, page: undefined, pageIndex: -1, sectionIndex: -1 };
    }

    const fallbackPage = currentSection.pages[0];
    const resolvedPageId = pageId ?? fallbackPage?.id;
    const currentPage = currentSection.pages.find((p) => p.id === resolvedPageId);

    const currentPageIndex = currentSection.pages.findIndex(p => p.id === currentPage?.id);
    const currentSectionIndex = sections.findIndex(s => s.id === currentSection.id);

    return { section: currentSection, page: currentPage, pageIndex: currentPageIndex, sectionIndex: currentSectionIndex };
  }, [sections, sectionId, pageId]);

  useEffect(() => {
    if (!section || !page) {
      const fallbackSection = sections[0];
      if (fallbackSection) {
        navigate(`/guide/${fallbackSection.id}/${fallbackSection.pages[0].id}`, { replace: true });
      }
    }
  }, [section, page, sections, navigate]);

  useEffect(() => {
    if (section) {
      setActiveSectionId(section.id);
    }
    // We scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [section, page, setActiveSectionId, location.key]);


  if (!section || !page) {
    return (
      <div className="section-fallback">
        <h1>Page not found</h1>
        <p>Select another page from the navigation to continue.</p>
      </div>
    );
  }

  const { previousPage, nextPage } = useMemo(() => {
    let prev;
    let next;

    // Previous page logic
    if (pageIndex > 0) {
      prev = { section, page: section.pages[pageIndex - 1] };
    } else if (sectionIndex > 0) {
      const prevSection = sections[sectionIndex - 1];
      prev = { section: prevSection, page: prevSection.pages[prevSection.pages.length - 1] };
    }

    // Next page logic
    if (pageIndex < section.pages.length - 1) {
      next = { section, page: section.pages[pageIndex + 1] };
    } else if (sectionIndex < sections.length - 1) {
      const nextSection = sections[sectionIndex + 1];
      next = { section: nextSection, page: nextSection.pages[0] };
    }

    return { previousPage: prev, nextPage: next };
  }, [section, pageIndex, sectionIndex, sections]);


  const getLink = (target: {section: typeof section, page: typeof page}) => {
      const isRoot = target.section.id === sections[0]?.id && target.page.id === sections[0]?.pages[0].id;
      return isRoot ? "/" : `/guide/${target.section.id}/${target.page.id}`;
  }

  return (
    <div className="section-view">
      <div className="section-view__content">
        <div className="section-view__intro">
          <span className="section-view__badge">{section.title}</span>
          <h1 className="section-view__title">
            {page.title}
          </h1>
          <p className="section-view__summary">{page.summary}</p>
          <div className="section-view__meta">
            <span>≈ {page.readingTimeMinutes} min read</span>
            <span>Updated in {new Date().getFullYear()}</span>
          </div>
        </div>
        <MarkdownContent content={page.content} headings={page.headings} />
        <nav className="section-view__pagination" aria-label="Section pagination">
          {previousPage ? (
            <Link
              to={getLink(previousPage)}
              className="section-view__pagination-link section-view__pagination-link--prev"
            >
              <span className="section-view__pagination-label">Previous</span>
              <span className="section-view__pagination-title">
                {previousPage.page.title}
              </span>
            </Link>
          ) : (
            <span className="section-view__pagination-placeholder" />
          )}

          {nextPage ? (
            <Link
              to={getLink(nextPage)}
              className="section-view__pagination-link section-view__pagination-link--next"
            >
              <span className="section-view__pagination-label">Next</span>
              <span className="section-view__pagination-title">
                {nextPage.page.title}
              </span>
            </Link>
          ) : (
            <span className="section-view__pagination-placeholder" />
          )}
        </nav>
      </div>
      <OutlinePanel headings={page.headings} />
    </div>
  );
};

export default GuideSectionPage;