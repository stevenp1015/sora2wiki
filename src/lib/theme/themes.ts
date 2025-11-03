import { useMemo } from "react";

export type ThemeMode = "light" | "dark";

export type ThemeId =
  | "atlas"
  | "nocturne"
  | "verdant"
  | "ember"
  | "cubey"
  | "sakura"
  | "copper"
  | "arctic"
  | "purp"
  | "coral"
  | "sunset"
  | "forest"
  | "sand"
  | "slate"
  | "rose"
  | "mint"
  | "indigo"
  | "amber"
  | "plum"
  | "ocean";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  preview: [string, string, string];
}

export interface ThemeSettings {
  themeId: ThemeId;
  mode: ThemeMode;
}

export const THEME_STORAGE_KEY = "sora2wiki.themeId";
export const MODE_STORAGE_KEY = "sora2wiki.themeMode";
export const DEFAULT_THEME_ID: ThemeId = "atlas";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "atlas",
    name: "Atlas",
    description: "Neutral daylight palette with warm highlight accents.",
    preview: ["#fafbfc", "#ffffff", "#dcca56"],
  },
  {
    id: "nocturne",
    name: "Nocturne",
    description: "Deep blues and violets evoke midnight command decks.",
    preview: ["#eef3ff", "#1b1f3a", "#7f8cff"],
  },
  {
    id: "verdant",
    name: "Verdant",
    description: "Botanical greens and grounded neutrals for calm focus.",
    preview: ["#f4fbf5", "#0f3528", "#3fb27f"],
  },
  {
    id: "ember",
    name: "Ember",
    description: "Smoky charcoal foundations with ember gradients.",
    preview: ["#fff5f0", "#29100b", "#ff7a55"],
  },
  {
    id: "cubey",
    name: "Cubey",
    description: "Frosted glass surfaces with aurora-inspired highlights.",
    preview: ["#f5f9ff", "#101b2d", "#4dd2ff"],
  },
  {
    id: "sakura",
    name: "Sakura",
    description: "Delicate cherry blossom pinks with spring warmth.",
    preview: ["#fff0f5", "#2d1820", "#ff6b9d"],
  },
  {
    id: "copper",
    name: "Copper",
    description: "Rich metallic copper with warm earth tones.",
    preview: ["#fff8f0", "#2b1810", "#d9724d"],
  },
  {
    id: "arctic",
    name: "Arctic",
    description: "Crisp glacial blues with polar clarity.",
    preview: ["#f0f8ff", "#0d1821", "#5eb3ff"],
  },
  {
    id: "purp",
    name: "Purp",
    description: "Soothing purp hues with pastoral serenity.",
    preview: ["#f8f5ff", "#1a1325", "#9d7bff"],
  },
  {
    id: "coral",
    name: "Coral",
    description: "Vibrant coral with complementary teal accents.",
    preview: ["#fff5f2", "#1f1815", "#ff7f6a"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange and purple gradient twilight.",
    preview: ["#fff4ed", "#1f1424", "#ff8f5c"],
  },
  {
    id: "forest",
    name: "Forest",
    description: "Deep woodland greens with natural depth.",
    preview: ["#f2f8f4", "#0f2419", "#2d8659"],
  },
  {
    id: "sand",
    name: "Sand",
    description: "Warm sandy beiges with sun-baked earth.",
    preview: ["#faf7f0", "#221e18", "#c9a76d"],
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool neutral grays for focused productivity.",
    preview: ["#f5f6f8", "#1a1d23", "#6b7785"],
  },
  {
    id: "rose",
    name: "Rose",
    description: "Elegant rose gold with luxe metallic warmth.",
    preview: ["#fff5f7", "#251a1c", "#e8a098"],
  },
  {
    id: "mint",
    name: "Mint",
    description: "Fresh mint greens with cooling clarity.",
    preview: ["#f0fdf8", "#0d2019", "#5ce0b0"],
  },
  {
    id: "indigo",
    name: "Indigo",
    description: "Rich indigo depths with stellar intensity.",
    preview: ["#f0f4ff", "#0f1428", "#5b6fff"],
  },
  {
    id: "amber",
    name: "Amber",
    description: "Warm amber and honey with golden luminance.",
    preview: ["#fffbf0", "#2a1f0d", "#ffb84d"],
  },
  {
    id: "plum",
    name: "Plum",
    description: "Deep plum purples with luxurious richness.",
    preview: ["#f9f5ff", "#1c1023", "#a566cc"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep oceanic blues with aquatic mystery.",
    preview: ["#f0f9fd", "#0a1821", "#2d9ece"],
  },
];

const THEME_IDS = new Set<ThemeId>(THEME_OPTIONS.map((option) => option.id));

const prefersDarkMode = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const isThemeId = (value: string | null): value is ThemeId =>
  Boolean(value && THEME_IDS.has(value as ThemeId));

export const applyTheme = (
  themeId: ThemeId,
  mode: ThemeMode,
  persist = true,
) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = themeId;
  root.style.colorScheme = mode;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  if (persist && typeof localStorage !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }
};

export const getInitialThemeSettings = (): ThemeSettings => {
  if (typeof window === "undefined") {
    return { themeId: DEFAULT_THEME_ID, mode: "light" };
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const storedMode = localStorage.getItem(MODE_STORAGE_KEY);

  const rootTheme = document.documentElement.dataset.theme ?? null;
  const rootMode = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  const themeId = isThemeId(storedTheme)
    ? storedTheme
    : isThemeId(rootTheme)
      ? rootTheme  // No need for type assertion here since isThemeId already narrowed the type
      : DEFAULT_THEME_ID;

  const mode: ThemeMode =
    storedMode === "light" || storedMode === "dark"
      ? (storedMode as ThemeMode)
      : prefersDarkMode()
        ? "dark"
        : (rootMode as ThemeMode);

  applyTheme(themeId, mode);

  return { themeId, mode };
};

export const useThemeOptions = () => useMemo(() => THEME_OPTIONS, []);
