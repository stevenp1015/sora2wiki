import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ThemeId, ThemeMode, ThemeSettings } from "./themes";
import { applyTheme, getInitialThemeSettings } from "./themes";

interface ThemeContextValue extends ThemeSettings {
  setThemeId: (themeId: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const initial = useMemo(() => getInitialThemeSettings(), []);
  const [settings, setSettings] = useState<ThemeSettings>(initial);

  const setThemeId = useCallback((themeId: ThemeId) => {
    setSettings((prev) => {
      if (prev.themeId === themeId) return prev;
      const next: ThemeSettings = { ...prev, themeId };
      applyTheme(next.themeId, next.mode);
      return next;
    });
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    setSettings((prev) => {
      if (prev.mode === mode) return prev;
      const next: ThemeSettings = { ...prev, mode };
      applyTheme(next.themeId, next.mode);
      return next;
    });
  }, []);

  const toggleMode = useCallback(() => {
    setSettings((prev) => {
      const nextMode: ThemeMode = prev.mode === "light" ? "dark" : "light";
      const next: ThemeSettings = { ...prev, mode: nextMode };
      applyTheme(next.themeId, next.mode);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId: settings.themeId,
      mode: settings.mode,
      setThemeId,
      setMode,
      toggleMode,
    }),
    [settings, setThemeId, setMode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
