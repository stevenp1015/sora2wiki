import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Palette, ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeContext } from "../../lib/theme/ThemeContext";
import { ThemeId, useThemeOptions } from "../../lib/theme/themes";
import { VerticalThemeWipeToggle } from "../../lib/ui/vertical-theme-wipe-toggle";

const ThemeControls: React.FC = () => {
  return (
    <div className="theme-controls">
      <VerticalThemeWipeToggle direction="top" className="theme-toggle" />
      <ThemePaletteMenu />
    </div>
  );
};

const ThemePaletteMenu: React.FC = () => {
  const { themeId, setThemeId, mode } = useThemeContext();
  const options = useThemeOptions();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerId = "theme-picker-trigger";

  const activeTheme = useMemo(
    () => options.find((option) => option.id === themeId),
    [options, themeId],
  );

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: PointerEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSelect = useCallback(
    (id: ThemeId) => {
      setThemeId(id);
      setOpen(false);
    },
    [setThemeId],
  );

  return (
    <div className="theme-picker" ref={menuRef}>
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        ref={triggerRef}
        className="theme-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Palette size={16} />
        <span className="theme-picker__label">
          {activeTheme ? activeTheme.name : "Choose theme"}
        </span>
        <span className="theme-picker__mode">{mode}</span>
        <ChevronDown
          size={13}
          className={cn("theme-picker__chevron", open && "is-open")}
        />
      </button>
      {open && (
        <div
          className="theme-picker__menu"
          role="listbox"
          aria-labelledby={triggerId}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.id === themeId}
              className={cn(
                "theme-picker__option",
                option.id === themeId && "is-active",
              )}
              onClick={() => handleSelect(option.id)}
            >
              <span className="theme-picker__swatches" aria-hidden>
                {option.preview.map((color) => (
                  <span
                    key={color}
                    className="theme-picker__swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeControls;
