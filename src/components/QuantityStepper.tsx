import { useState } from "react";

const BLUE = "#116dff";
const BORDER = "#aeaeae";
const FILL = "#f6f6f6";
const INK = "#010400";

/** Only the two buttons take hover; the middle cell is a read-out. */
type Cell = 0 | 2;

export type QuantityStepperProps = {
  quantity: number;
  onDec: () => void;
  onInc: () => void;
  /** Container box in the frame's own 1920-wide coordinates. */
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
  /** Container stroke width, matching the frame's own border. */
  borderWidth: number;
  /** The three cell widths; must sum to `width`. Derived from where the
   *  frame draws its two vertical dividers. */
  cells: [number, number, number];
  /** Divider stroke and its inset from the container's top / bottom edge. */
  dividerWidth: number;
  dividerInsetTop: number;
  dividerInsetBottom: number;
  /** Glyph box and stroke for the − / + marks, also lifted from the frame. */
  glyph: number;
  glyphStroke: number;
  fontSize: number;
};

/**
 * Quantity stepper — one component for both the Product and Cart pages.
 *
 * The Figma frames underneath already draw this control as a rounded container
 * split into three cells by two vertical hairlines: [−] [count] [+]. The
 * overlay is opaque and covers the frame's copy exactly, so it has to redraw
 * all of it — container, both dividers, and the glyphs — rather than only the
 * parts that react. Every measurement therefore comes in as a prop, read
 * straight out of the frame source, because the two pages draw the control at
 * different sizes (115.5×54 on Product, 153×62 on Cart) with different stroke
 * widths.
 *
 * Hover paints a whole cell blue, per the design language (blue = active).
 * Only the two buttons respond: the middle cell is a read-out, and colouring it
 * on hover would advertise a click that does nothing.
 *
 * Dividers sit *under* the cells and the one adjacent to the hovered cell is
 * hidden, so a blue cell reads as one solid block instead of a blue field with
 * a stray hairline bisecting its edge.
 */
export default function QuantityStepper({
  quantity,
  onDec,
  onInc,
  left,
  top,
  width,
  height,
  radius,
  borderWidth,
  cells,
  dividerWidth,
  dividerInsetTop,
  dividerInsetBottom,
  glyph,
  glyphStroke,
  fontSize,
}: QuantityStepperProps) {
  const [hovered, setHovered] = useState<Cell | null>(null);

  // Cell edges along the container's *border* box. Children are laid out
  // against the padding box, so every offset below subtracts borderWidth.
  const edges = [0, cells[0], cells[0] + cells[1], width];

  const cellBox = (i: 0 | 1 | 2): React.CSSProperties => ({
    position: "absolute",
    left: edges[i] - borderWidth,
    top: -borderWidth,
    width: cells[i],
    height,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: hovered === i ? BLUE : "transparent",
    color: hovered === i ? "#fff" : INK,
    transition: "background-color 120ms linear, color 120ms linear",
  });

  const hoverProps = (i: Cell) => ({
    onMouseEnter: () => setHovered(i),
    onMouseLeave: () => setHovered((h) => (h === i ? null : h)),
  });

  // A glyph bar takes its colour from the cell so it flips to white on hover.
  const bar = (w: number, h: number): React.CSSProperties => ({
    position: "absolute",
    width: w,
    height: h,
    background: "currentColor",
  });

  return (
    <div
      className="absolute"
      style={{
        left,
        top,
        width,
        height,
        boxSizing: "border-box",
        borderRadius: radius,
        border: `${borderWidth}px solid ${BORDER}`,
        background: FILL,
        overflow: "hidden",
      }}
    >
      {/* Two hairline dividers, clipped by the container's rounded corners. */}
      {([0, 1] as const).map((i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: edges[i + 1] - borderWidth - dividerWidth / 2,
            top: dividerInsetTop - borderWidth,
            width: dividerWidth,
            height: height - dividerInsetTop - dividerInsetBottom,
            background: BORDER,
            zIndex: 0,
            // Divider 0 abuts the − button, divider 1 the + button.
            opacity: hovered === (i === 0 ? 0 : 2) ? 0 : 1,
            transition: "opacity 120ms linear",
          }}
        />
      ))}

      <button
        onClick={onDec}
        {...hoverProps(0)}
        className="cursor-pointer"
        style={cellBox(0)}
        aria-label="Decrease quantity"
      >
        <span style={bar(glyph, glyphStroke)} />
      </button>

      <div
        style={cellBox(1)}
        className="font-['Questrial:Regular',sans-serif] select-none uppercase"
      >
        <span style={{ fontSize, letterSpacing: "-1px", lineHeight: 1 }}>{quantity}</span>
      </div>

      <button
        onClick={onInc}
        {...hoverProps(2)}
        className="cursor-pointer"
        style={cellBox(2)}
        aria-label="Increase quantity"
      >
        <span style={{ position: "relative", width: glyph, height: glyph }}>
          <span style={{ ...bar(glyph, glyphStroke), top: (glyph - glyphStroke) / 2, left: 0 }} />
          <span style={{ ...bar(glyphStroke, glyph), left: (glyph - glyphStroke) / 2, top: 0 }} />
        </span>
      </button>
    </div>
  );
}
