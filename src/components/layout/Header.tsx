import React, { ChangeEvent, useEffect, useRef } from "react";
import { useLayoutContext } from "./LayoutContext";
import ThemeControls from "./ThemeControls";

const Header: React.FC = () => {
  const { searchTerm, setSearchTerm, activeSection } = useLayoutContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const activeTagName = (
          document.activeElement?.tagName ?? ""
        ).toLowerCase();
        const isTypingTarget = ["input", "textarea"].includes(activeTagName);
        if (!isTypingTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <header className="wiki-header">
      <div className="wiki-header__brand">
        <span className="wiki-header__glyph" aria-hidden>
          ◎
        </span>
        <div>
          <div className="wiki-header__title">Sora² Atlas</div>
          <div className="wiki-header__subtitle">
            Operator manual for OpenAI's cinematic engine
          </div>
        </div>
      </div>
      <ThemeControls />
      <div className="wiki-header__meta">
        {activeSection && (
          <div className="wiki-header__active">
            <span className="wiki-header__active-label">Now viewing</span>
            <span className="wiki-header__active-title">
              {activeSection.fullTitle ?? activeSection.title}
            </span>
            <span className="wiki-header__active-time">
              ≈ {activeSection.readingTimeMinutes} min read
            </span>
          </div>
        )}
        <label className="wiki-search">
          <span className="visually-hidden">Filter sections</span>
          <input
            type="search"
            className="wiki-search__input"
            placeholder="Search the atlas"
            value={searchTerm}
            onChange={handleChange}
            ref={inputRef}
          />
          <kbd className="wiki-search__hint">⌘K</kbd>
        </label>
      </div>
    </header>
  );
};

export default Header;
