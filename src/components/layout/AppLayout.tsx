import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Header from "./Header";
import SidebarNav from "./SidebarNav";
import { LayoutContext } from "./LayoutContext";
import type { GuideSection } from "../../lib/sections";

interface AppLayoutProps {
  sections: GuideSection[];
}

const AppLayout: React.FC<AppLayoutProps> = ({ sections }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId),
    [sections, activeSectionId],
  );

  const contextValue = useMemo(
    () => ({
      sections,
      searchTerm,
      setSearchTerm,
      setActiveSectionId,
      activeSection,
    }),
    [sections, searchTerm, setSearchTerm, setActiveSectionId, activeSection],
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="wiki-shell">
        <ScrollToTop />
        <Header />
        <div className="wiki-body">
          <SidebarNav />
          <div className="wiki-content">
            <Outlet />
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default AppLayout;
