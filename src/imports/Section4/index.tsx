import { useEffect, useState } from "react";
import imgSpiralLarge from "./spiral-large.svg";
import imgSpiralSmall from "./spiral-small.svg";

/**
 * Distance from the start of one Logo copy to the start of the next, i.e. how
 * far the marquee travels per loop. Measured on ink (glyphs plus their 4px
 * stroke): "DROP" ends at x=3210.8 of the group, and the large spiral sits
 * 94.4px before the "S" of "SOLE", so the next copy starts the same 94.4px
 * after the "P" to keep the rhythm even across the seam.
 */
const LOOP_W = 3305.2;

/** Seconds per loop (LOOP_W px), i.e. roughly 110px/s. */
const LOOP_S = 30;

/**
 * One letter of the wordmark. On hover it swaps to Italianno, but the slot keeps
 * the Gowun Batang advance width: both glyphs share one grid cell (baseline
 * aligned), and the Italianno one sits in a zero-width, line-height-0 box that
 * centres it without contributing any width or height. Otherwise the narrower
 * script glyph would pull every following letter left, the hovered letter could
 * slide out from under the cursor and flicker back.
 */
function Letter({ ch }: { ch: string }) {
  return (
    <span className="logo-letter">
      <span className="logo-letter-base">{ch}</span>
      <span className="logo-letter-alt">{ch}</span>
    </span>
  );
}

function Word({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <Letter key={i} ch={ch} />
      ))}
    </>
  );
}

/**
 * The Figma "Logo" group, positioned relative to its own top-left corner.
 * `filter` reproduces the group's two inner shadows (see #logo-emboss below).
 */
function Logo({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="relative h-[539px] shrink-0"
      style={{ width: LOOP_W, filter: "url(#logo-emboss)" }}
      {...(hidden ? { "aria-hidden": true } : { role: "img", "aria-label": "SOLE DROP" })}
    >
      <img
        alt=""
        draggable={false}
        className="absolute left-0 top-[61.6px] block max-w-none"
        width="1029.24"
        height="381.869"
        src={imgSpiralLarge}
      />
      <p
        aria-hidden
        className="logo-wordmark absolute left-[1112.93px] top-0 font-['Gowun_Batang:Regular',sans-serif] leading-[normal] not-italic text-[#96847a] text-[371.904px] whitespace-pre"
      >
        <Word text="SOLE" />
        {" "}
        <span className="tracking-[0.06em]"> </span>
        <Word text="DROP" />
      </p>
      <img
        alt=""
        draggable={false}
        className="absolute left-[2042.48px] top-[143.07px] block max-w-none"
        width="163.959"
        height="157.351"
        src={imgSpiralSmall}
      />
    </div>
  );
}

/**
 * Section 4: the SOLE DROP wordmark as an endless left-moving marquee on lime.
 * Frame 0 is the Figma layout (large spiral bleeding 322px off the left edge);
 * the track then slides left by one copy width per loop, and the second copy
 * lands exactly where the first began, so the reset is invisible.
 *
 * Clicking the section (or Enter / Space when focused) toggles the marquee
 * between paused and running; the animation resumes from where it stopped.
 */
export default function Section4() {
  const [paused, setPaused] = useState(false);
  const toggle = () => setPaused((p) => !p);

  // Italianno is only used on hover, so the browser would not fetch it until the
  // first hovered letter, which would render a blank frame. Fetch it up front.
  useEffect(() => {
    document.fonts?.load("100px Italianno").catch(() => {});
  }, []);

  return (
    // No text selection or image dragging, and a hand cursor since the whole
    // section is a pause/play toggle. Hover still reaches the letters, so the
    // Italianno swap keeps working.
    <div
      role="button"
      tabIndex={0}
      aria-pressed={paused}
      aria-label={paused ? "Play the SOLE DROP animation" : "Pause the SOLE DROP animation"}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className="bg-[#e5fb79] relative size-full overflow-clip select-none cursor-pointer"
      data-name="Section 4"
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        {/* Figma's two INNER_SHADOW effects on the Logo group, in Figma's own
            SVG-export form (blur radius r becomes stdDeviation r/2). */}
        <filter id="logo-emboss" x="-2%" y="-5%" width="104%" height="110%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="1.7464" dy="3.4929" />
          <feGaussianBlur stdDeviation="1.1643" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.7474  0 0 0 0 0.7474  0 0 0 0 0.7474  0 0 0 1 0" />
          <feBlend mode="normal" in2="SourceGraphic" result="shadow1" />
          <feOffset in="hardAlpha" dx="1.1643" dy="-5.8214" />
          <feGaussianBlur stdDeviation="1.7464" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shadow1" />
        </filter>
      </svg>

      <div
        className="logo-marquee absolute left-[-322px] top-[15px] flex"
        data-paused={paused || undefined}
        style={{ "--loop-w": `${LOOP_W}px`, "--loop-s": `${LOOP_S}s` } as React.CSSProperties}
      >
        <Logo />
        <Logo hidden />
      </div>
    </div>
  );
}
