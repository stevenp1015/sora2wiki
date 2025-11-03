import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Header from "./Header";
import SidebarNav from "./SidebarNav";
import { LayoutContext } from "./LayoutContext";

export interface NavItem {
  id: string;
  title: string;
  full_title?: string;
  fullTitle?: string; // Alias for full_title for consistency
  description?: string;
  summary?: string;
  path?: string;
  content?: string;
  readingTimeMinutes?: number;
  headings?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  items?: NavItem[];
  // For categories
  category_title?: string;
  category_slug?: string;
  category_description?: string;
  // For articles
  article_title?: string;
  article_slug?: string;
  seo_description?: string;
  content_markdown?: string;
}

interface AppLayoutProps {
  navItems: NavItem[];
}

const AppLayout: React.FC<AppLayoutProps> = ({ navItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");
  const location = useLocation();

  // Find active section based on URL
  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    
    const findSection = (items: NavItem[]): NavItem | undefined => {
      for (const item of items) {
        if (item.id === activeSectionId) return item;
        if (item.items) {
          const found = findSection(item.items);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findSection(navItems) || null;
  }, [activeSectionId, navItems]);

  // Flatten nav items for search
  const flattenNavItems = useMemo(() => {
    const result: NavItem[] = [];
    
    const flatten = (items: NavItem[]) => {
      items.forEach(item => {
        // Only add items that are actual content (not just categories)
        if (item.article_title || item.content || item.content_markdown) {
          result.push(item);
        }
        
        if (item.items) {
          flatten(item.items);
        }
      });
    };
    
    flatten(navItems);
    return result;
  }, [navItems]);

  // Set active section based on URL
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      // Home page
      setActiveSectionId(navItems[0]?.id || '');
      return;
    }
    
    // Try to find matching section
    const findMatchingSection = (items: NavItem[]): string | undefined => {
      for (const item of items) {
        // Check if this item matches the URL
        const itemPath = item.path || 
                        (item.article_slug && item.category_slug 
                          ? `/${item.category_slug}/${item.article_slug}` 
                          : `/${item.id}`);
        
        if (itemPath === location.pathname) {
          return item.id;
        }
        
        // Check child items
        if (item.items) {
          const childMatch = findMatchingSection(item.items);
          if (childMatch) return childMatch;
        }
      }
      return undefined;
    };
    
    const match = findMatchingSection(navItems);
    if (match) {
      setActiveSectionId(match);
    }
  }, [location.pathname, navItems]);

  const contextValue = useMemo(
    () => ({
      sections: navItems,
      searchTerm,
      setSearchTerm,
      setActiveSectionId,
      activeSection,
    }),
    [navItems, searchTerm, activeSection],
  );

  const handleNavigate = () => {
    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu?.classList.contains('open')) {
      mobileMenu.classList.remove('open');
    }
    
    // Optionally, you could also scroll to top on navigation
    window.scrollTo(0, 0);
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="wiki-shell">
        <ScrollToTop />
        <Header />
        <div className="wiki-body">
          <SidebarNav 
            navItems={navItems}
            searchTerm={searchTerm}
            onNavigate={handleNavigate}
          />
          <div className="wiki-content" data-scroll-container="true">
            <Outlet />
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default AppLayout;
