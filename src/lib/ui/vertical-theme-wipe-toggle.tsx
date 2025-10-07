"use client";

import { useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils";
import { useThemeContext } from "../theme/ThemeContext";

type VerticalDirection = "top" | "bottom";

type VerticalThemeWipeToggleProps = {
  className?: string;
  direction?: VerticalDirection;
};

export const VerticalThemeWipeToggle = ({
  className,
  direction = "top",
}: VerticalThemeWipeToggleProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { mode, setMode } = useThemeContext();
  const darkMode = mode === "dark";

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return;

    const nextMode = darkMode ? "light" : "dark";
    const startTransition: (callback: () => void) => {
      ready: Promise<void>;
    } = (document as any).startViewTransition
      ? (document as any).startViewTransition.bind(document)
      : (callback: () => void) => {
          callback();
          return { ready: Promise.resolve() };
        };

    const transition = startTransition(() => {
      flushSync(() => setMode(nextMode));
    });

    await transition.ready;

    if (direction === "top") {
      // Top-to-bottom animation
      document.documentElement.animate(
        {
          clipPath: [
            "inset(0 0 100% 0)", // bottom fully covered, reveal downward
            "inset(0 0 0 0)", // fully revealed
          ],
        },
        {
          duration: 618,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } else {
      // Bottom-to-top animation
      document.documentElement.animate(
        {
          clipPath: [
            "inset(100% 0 0 0)", // top fully covered, reveal upward
            "inset(0 0 0 0)", // fully revealed
          ],
        },
        {
          duration: 618,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }

    // Disable the default fade-out animation on the old view to prevent a "flash"
    document.documentElement.animate(
      { opacity: [1, 1] },
      {
        duration: 618,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-old(root)",
      },
    );
  }, [darkMode, direction, setMode]);

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label="Switch theme"
      className={cn(
        "relative flex items-center justify-center p-2 rounded-full outline-none focus-visible:theme-outline focus:ring-0 cursor-pointer z-50",
        className,
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-white"
          >
            <Sun />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            className="text-black"
          >
            <Moon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
