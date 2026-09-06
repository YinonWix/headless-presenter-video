import { useState } from "react";
import HeroSection1 from "./HeroSection1";
import HeroSection2 from "./HeroSection2";
import HeroSection2Hover from "./HeroSection2Hover";
import ProductPage from "./ProductPage";
import ProductPagePressed from "./ProductPagePressed";
import CheckoutPage from "./CheckoutPage";
import CheckoutPageHover from "./CheckoutPageHover";

const PAGES = [
  { id: "hero-1", label: "Hero — Section 1", component: HeroSection1 },
  { id: "hero-2", label: "Hero — Section 2", component: HeroSection2 },
  { id: "hero-2-hover", label: "Hero — Section 2 (Hover)", component: HeroSection2Hover },
  { id: "product", label: "Product Page", component: ProductPage },
  { id: "product-pressed", label: "Product Page pressed", component: ProductPagePressed },
  { id: "checkout", label: "Checkout Page", component: CheckoutPage },
  { id: "checkout-hover", label: "Checkout Page (Hover)", component: CheckoutPageHover },
] as const;

const DESIGN_W = 1920;
const DESIGN_H = 1088;

export default function PresenterKit() {
  const [current, setCurrent] = useState(0);
  const Page = PAGES[current].component;

  function prev() { setCurrent(c => Math.max(0, c - 1)); }
  function next() { setCurrent(c => Math.min(PAGES.length - 1, c + 1)); }

  return (
    <div className="fixed inset-0 bg-[#111] flex flex-col">
      {/* Toolbar */}
      <div className="shrink-0 h-12 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <span className="font-['Questrial:Regular',sans-serif] text-[#e5fb79] text-[13px] font-semibold tracking-wider uppercase">
            Presenter Kit headless3
          </span>
          <span className="text-[#555] text-xs">·</span>
          <span className="font-['Questrial:Regular',sans-serif] text-[#888] text-[12px]">
            {current + 1} / {PAGES.length} — {PAGES[current].label}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-3 py-1 rounded bg-[#2a2a2a] border border-[#444] text-[#ccc] text-[12px] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={current === PAGES.length - 1}
            className="px-3 py-1 rounded bg-[#2a2a2a] border border-[#444] text-[#ccc] text-[12px] disabled:opacity-30 hover:bg-[#333] transition-colors"
          >
            Next →
          </button>
        </div>
        {/* Page pills */}
        <div className="flex gap-1">
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-[#e5fb79]" : "bg-[#444] hover:bg-[#666]"
              }`}
              title={p.label}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <ScaledCanvas>
          <Page />
        </ScaledCanvas>
      </div>

      {/* Bottom page list */}
      <div className="shrink-0 h-10 bg-[#1a1a1a] border-t border-[#333] flex items-center gap-1 px-4 overflow-x-auto">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrent(i)}
            className={`shrink-0 px-3 py-1 rounded text-[11px] font-['Questrial:Regular',sans-serif] transition-colors whitespace-nowrap ${
              i === current
                ? "bg-[#e5fb79] text-[#1c1d21]"
                : "text-[#888] hover:text-[#ccc] hover:bg-[#2a2a2a]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScaledCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{ width: DESIGN_W, height: DESIGN_H }}
    >
      <ScaleWrapper>{children}</ScaleWrapper>
    </div>
  );
}

function ScaleWrapper({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  const containerRef = (el: HTMLDivElement | null) => {
    if (!el) return;
    const parent = el.parentElement?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const sx = rect.width / DESIGN_W;
    const sy = rect.height / DESIGN_H;
    const s = Math.min(sx, sy);
    if (Math.abs(s - scale) > 0.001) setScale(s);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: `${-(DESIGN_W * scale) / 2}px ${-(DESIGN_H * scale) / 2}px`,
      }}
    >
      {children}
    </div>
  );
}
