import React, { createContext, useContext } from "react";
import { GuideSection } from "../../lib/sections";

type LayoutContextValue = {
  sections: GuideSection[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setActiveSectionId: (id: string) => void;
  activeSection?: GuideSection;
};

export const LayoutContext = createContext<LayoutContextValue | undefined>(
  undefined,
);

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayoutContext must be used within LayoutContext.Provider");
  }
  return ctx;
};

export type { LayoutContextValue };
