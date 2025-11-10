import React, { createContext, useContext } from "react";
import type { WikiContent } from "../../content/types";

type LayoutContextValue = {
  wikiContent: WikiContent;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  expandedCategories: Set<string>;
  toggleCategory: (categorySlug: string) => void;
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
