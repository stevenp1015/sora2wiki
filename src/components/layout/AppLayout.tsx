import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Header from "./Header";
import SidebarNav from "./SidebarNav";
import { LayoutContext } from "./LayoutContext";
import { wikiContent } from "../../content";

const AppLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categorySlug)) {
        next.delete(categorySlug);
      } else {
        next.add(categorySlug);
      }
      return next;
    });
  };

  const contextValue = useMemo(
    () => ({
      wikiContent,
      searchTerm,
      setSearchTerm,
      expandedCategories,
      toggleCategory,
    }),
    [searchTerm, expandedCategories]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="wiki-shell ">
        <ScrollToTop />
        <Header />
        <div className="wiki-body">
          <SidebarNav />
          <div className="wiki-content" data-scroll-container="true">
            <Outlet />
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default AppLayout;
