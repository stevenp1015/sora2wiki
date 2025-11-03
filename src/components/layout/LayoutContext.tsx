import React, { createContext, useContext } from "react";
import { NavItem } from "./AppLayout";

type LayoutContextValue = {
  sections: NavItem[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setActiveSectionId: (id: string) => void;
  activeSection: NavItem | null;
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
