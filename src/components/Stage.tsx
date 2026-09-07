import { useLayoutEffect, useRef, useState } from "react";

const DESIGN_W = 1920;

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
 */
export default function Stage({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const measure = () => {
      const width = outer.clientWidth;
      // A 0 width means the stage isn't laid out yet (hidden/background tab).
      // Fall back to scale 1 so content stays visible rather than collapsing.
      const next = width > 0 ? width / DESIGN_W : 1;
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
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={outerRef} className="w-full overflow-x-hidden bg-white">
      <div style={{ width: DESIGN_W, zoom: scale }}>{children}</div>
    </div>
  );
}
