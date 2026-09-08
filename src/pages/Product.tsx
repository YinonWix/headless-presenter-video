import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductPage from "@/imports/ProductPage-1";
import QuantityStepper from "@/components/QuantityStepper";
import LogoHomeLink from "@/components/LogoHomeLink";
import { PRODUCT, useCart } from "@/store/CartContext";

const LIME = "#e5fb79";
const BLUE = "#116dff";

// Exact geometry lifted from the Figma export (1920-wide frame). The overlays
// must sit *exactly* on top of the controls the frame already draws underneath,
// otherwise the frame's border/fill peeks out (double border, lime showing
// through the blue hover). These tops are measured against the rendered frame.
const SIZE_TOP = 453.59;
const SIZE_BOX = 54;
const SIZE_LEFTS = [959.5, 1021.5, 1083.51, 1145.43]; // 8, 9, 10, 11

/**
 * Product page (Røket-9). The Figma frame renders underneath for pixel fidelity;
 * the three live controls are opaque overlays placed at the frame's own
 * coordinates: size selector, quantity stepper, and Add to cart. Selections use
 * the blue = active design language and are stored in the cart context so the
 * Cart page reflects them.
 */
export default function Product() {
  const navigate = useNavigate();
  const { size, setSize, quantity, incQuantity, decQuantity } = useCart();
  const [cartHover, setCartHover] = useState(false);
  const [hoveredSize, setHoveredSize] = useState<number | null>(null);

  function addToCart() {
    navigate("/cart");
  }

  return (
    <div className="relative" style={{ width: 1920, height: 1088 }}>
      <ProductPage />

      {/* Header mark -> home. Hit area only; the frame draws the logo. */}
      <LogoHomeLink />

      {/* Size selector */}
      {PRODUCT.sizes.map((s, i) => {
        const selected = size === s;
        const hovered = hoveredSize === s;
        // States: hover → blue, else selected → black, else default (light grey).
        // Hover takes precedence over selection.
        const bg = hovered ? BLUE : selected ? "#000" : "#f6f6f6";
        const border = hovered ? BLUE : selected ? "#000" : "#aeaeae";
        const color = hovered || selected ? "#fff" : "#000";
        return (
          <button
            key={s}
            onClick={() => setSize(s)}
            onMouseEnter={() => setHoveredSize(s)}
            onMouseLeave={() => setHoveredSize(null)}
            className="absolute flex items-center justify-center font-['Questrial:Regular',sans-serif] text-[20px] tracking-[-1px] uppercase cursor-pointer transition-colors"
            style={{
              left: SIZE_LEFTS[i],
              top: SIZE_TOP,
              width: SIZE_BOX,
              height: SIZE_BOX,
              borderRadius: 12,
              border: `0.5px solid ${border}`,
              background: bg,
              color,
            }}
          >
            {s}
          </button>
        );
      })}

      {/* Quantity stepper. Geometry is read straight out of ProductPage-1:
          the container is drawn at top 323.88 inside the `Rest` wrapper, which
          itself sits 7.12px down the frame (bottom -11.12 on a 1092-tall box in
          an 1088-tall frame) — hence 331. The cell widths come from where that
          frame draws its two dividers, at +41.44 and +75.34. */}
      <QuantityStepper
        quantity={quantity}
        onDec={decQuantity}
        onInc={incQuantity}
        left={960}
        top={331}
        width={115.525}
        height={53.995}
        radius={12}
        borderWidth={0.5}
        cells={[41.44, 33.9, 40.185]}
        dividerWidth={0.502281}
        dividerInsetTop={2.51}
        dividerInsetBottom={2.51}
        glyph={10.423}
        glyphStroke={1.489}
        fontSize={20}
      />

      {/* Add to cart */}
      <button
        onClick={addToCart}
        onMouseEnter={() => setCartHover(true)}
        onMouseLeave={() => setCartHover(false)}
        className="absolute cursor-pointer transition-colors"
        style={{
          left: 959.37,
          top: 841.27,
          width: 835.803,
          height: 83.956,
          borderRadius: 12.531,
          background: cartHover ? BLUE : LIME,
        }}
      >
        {/* Both labels are positioned by box top + an explicit line-height, because the
            baseline is top + lineHeight/2 + ascent -- leaving the line-height at `normal`
            moves the ink even when the top is right, and the two fonts have different
            metrics, so it moved them in opposite directions.

            The tops are NOT the frame's. The frame draws these same two texts underneath,
            but it puts the price 6.73px and the label 2.49px below the bar's true centre
            (83.956 / 2 = 41.978), leaving them 4.24px apart -- which is the misalignment
            you can see. For the price that is a Make export bug: a centred 35.811 line box
            belongs at 834.16 + (83.956 - 35.811) / 2 = 858.23, and the frame says 865.49,
            7.26px lower -- the 7.11px `Rest` wrapper offset, baked into the top and then
            applied a second time by the wrapper. So these tops centre each text's own ink
            box (digits for the price, caps for the label) on the bar instead. Safe to
            deviate: this button is opaque and fully covers the frame's copies. */}
        <span
          className="absolute font-['Questrial:Regular',sans-serif] text-[20px] tracking-[-1px] uppercase whitespace-nowrap"
          style={{ left: 41.35, top: 24.61, lineHeight: "35.811px", color: cartHover ? "#fff" : "#000" }}
        >
          ${PRODUCT.price.toFixed(2)}
        </span>
        <span
          className="absolute -translate-x-1/2 font-['Gowun_Batang:Regular',sans-serif] text-[19.987px] tracking-[0.9994px] uppercase whitespace-nowrap"
          style={{ left: 685.85, top: 41.38, lineHeight: "0px", color: cartHover ? "#fff" : "#000" }}
        >
          add to cart
        </span>
      </button>
    </div>
  );
}
