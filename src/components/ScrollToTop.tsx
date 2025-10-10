import React, { useEffect, useRef } from "react";
import { getScrollContainer } from "../lib/utils";

const ScrollToTop: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    scrollContainerRef.current = getScrollContainer();

    let ticking = false;

    const update = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const docHeight = container.scrollHeight - container.clientHeight;
        const progress =
          docHeight > 0 ? (container.scrollTop / docHeight) * 100 : 0;
        button.dataset.visible = progress > 18 ? "true" : "false";
        button.style.setProperty("--scroll-progress", progress.toFixed(2));
      } else {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        button.dataset.visible = progress > 18 ? "true" : "false";
        button.style.setProperty("--scroll-progress", progress.toFixed(2));
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    const target: HTMLElement | Window =
      scrollContainerRef.current ?? window;
    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="scroll-to-top"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
