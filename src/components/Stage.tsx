import { useLayoutEffect, useRef, useState } from "react";

const DESIGN_W = 1920;

/**
 * Pages at or below this design height are a single screen and must fit the
 * viewport without scrolling; taller pages are intentionally multi-section
 * (Home stacks two 1088px sections = 2176px) and are meant to scroll.
 */
const SINGLE_SCREEN_MAX_H = 1200;

/**
 * Fixed 1920-wide desktop stage. The design is pixel-accurate at 1920px; on any
 * other container width we scale uniformly so the 16:9 proportions are preserved
 * and nothing reflows (this is a desktop-only demo — no responsive layout).
 *
 * Scaling uses CSS `zoom`, not `transform: scale()`. `transform` leaves the
 * element's *layout* box at full size (forcing us to hand-compute a scaled outer
 * height) and, more importantly, promotes the whole page to one big GPU layer
 * that is re-rasterised from a fractional transform every frame. On a Retina
 * screen (DPR 2) that snaps to device pixels cleanly, but on an external monitor
 * (DPR 1, or an OS scale like 1.25/1.5) the sub-pixel snapping jitters frame to
 * frame — the whole page visibly shimmers. `zoom` scales the real layout box
 * instead: the document height stays correct on its own, text renders crisply at
 * the target DPR, and there is no fractional-transform layer to shimmer.
 *
 * Scale is derived from the *container's own* width (via ResizeObserver), not
 * `window.innerWidth`: the latter can read 0 during a background/hidden load or
 * an early effect pass, which would produce `zoom: 0` and collapse the whole
 * page to a blank screen. We guard against a 0 width and measure synchronously in
 * `useLayoutEffect` so the very first painted frame already has the right size.
 * Only the outer container is observed, and its width is independent of the inner
 * zoom, so there is no ResizeObserver write-back loop.
 *
 * A single-screen page (see SINGLE_SCREEN_MAX_H) is additionally capped by the
 * viewport height. Filling the width alone is not enough to avoid a scrollbar:
 * the frames are 1088px tall, i.e. an aspect of 1.765 against a 16:9 monitor's
 * 1.778, so a width-fitted page ends up slightly *taller* than the screen and
 * scrolls by a few pixels (much more on an ultrawide). Capping by height costs a
 * few pixels of white margin at the sides and guarantees no scrolling.
 */
export default function Stage({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const width = outer.clientWidth;
      // A 0 width means the stage isn't laid out yet (hidden/background tab).
      // Keep the current scale so content stays visible rather than collapsing.
      if (width <= 0) return;
      let next = width / DESIGN_W;

      // `offsetHeight` is reported in the element's own pre-zoom pixels, so this
      // reads the *design* height (1088, 2176, …) whatever zoom we have applied.
      // That is what makes it safe to feed back into the scale we compute here.
      const designH = inner.offsetHeight;
      const viewportH = document.documentElement.clientHeight;
      if (designH > 0 && designH <= SINGLE_SCREEN_MAX_H && viewportH > 0) {
        next = Math.min(next, viewportH / designH);
      }

      // Skip sub-pixel changes: a fractional container width can jitter by a
      // fraction of a pixel between observer callbacks, and each committed
      // change re-rasterises the whole page. Only commit a visible difference.
      setScale((prev) => (Math.abs(next - prev) < 0.0005 ? prev : next));
    };
    measure();

    // Coalesce observer callbacks to at most one measurement per frame, so a
    // burst of layout changes can never produce more than one re-raster.
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(outer); // container width changes (window resize, pane show/hide)
    ro.observe(inner); // design height changes (navigating between pages)
    // Viewport *height* alone never resizes the containers, so listen for it too.
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    // `overflow-clip` on both axes, not `overflow-x-hidden`: the Figma frames
    // contain decorative images that deliberately bleed past the frame (the
    // product photo is 1638px tall inside an 1088px frame) and nothing in the
    // generated markup clips them. `overflow-x-hidden` forces the *other* axis to
    // `auto`, which turned this container into a scroller with ~365px of hidden
    // bleed to scroll through. `clip` crops the bleed the way the frame does in
    // Figma without creating a scroll container at all.
    <div ref={outerRef} className="w-full overflow-clip bg-white">
      <div ref={innerRef} className="mx-auto" style={{ width: DESIGN_W, zoom: scale }}>
        {children}
      </div>
    </div>
  );
}
