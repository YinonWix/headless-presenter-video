import { useLayoutEffect, useRef, useState } from "react";

const DESIGN_W = 1920;

/**
 * Fixed 1920-wide desktop stage. The design is pixel-accurate at 1920px; on any
 * other container width we scale uniformly so the 16:9 proportions are preserved
 * and nothing reflows (this is a desktop-only demo — no responsive layout).
 *
 * Scale is derived from the *container's own* width (via ResizeObserver), not
 * `window.innerWidth`: the latter can read 0 during a background/hidden load or
 * an early effect pass, which would produce `scale(0)` and collapse the whole
 * page to a blank screen. We guard against a 0 width and measure synchronously in
 * `useLayoutEffect` so the very first painted frame already has the right size.
 *
 * `transform: scale()` doesn't shrink the element's layout box, so the outer
 * wrapper is given the *scaled* height (measured from the content) to keep the
 * document scroll height correct and avoid empty space below the page.
 */
export default function Stage({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(0);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const width = outer.clientWidth;
      // A 0 width means the stage isn't laid out yet (hidden/background tab).
      // Fall back to scale 1 so content stays visible rather than collapsing.
      setScale(width > 0 ? width / DESIGN_W : 1);
      setContentH(inner.offsetHeight);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(outer); // container width changes (window resize, pane show/hide)
    ro.observe(inner); // content height changes (route change, images load)
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-x-hidden bg-white"
      style={{ height: contentH * scale }}
    >
      <div
        ref={innerRef}
        style={{
          width: DESIGN_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
