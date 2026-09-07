import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductPage from "@/imports/ProductPage-1";
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

  const qtyChanged = quantity !== 1;

  function addToCart() {
    navigate("/cart");
  }

  return (
    <div className="relative" style={{ width: 1920, height: 1088 }}>
      <ProductPage />

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

      {/* Quantity stepper */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          left: 960,
          top: 330.99,
          width: 115.525,
          height: 53.995,
          borderRadius: 12,
          border: `0.5px solid ${qtyChanged ? BLUE : "#aeaeae"}`,
          background: "#f6f6f6",
        }}
      >
        <button
          onClick={decQuantity}
          className="h-full w-[38px] flex items-center justify-center text-[22px] leading-none cursor-pointer"
          style={{ color: "#010400" }}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span
          className="font-['Questrial:Regular',sans-serif] text-[20px] tracking-[-1px] uppercase select-none"
          style={{ color: qtyChanged ? BLUE : "#000" }}
        >
          {quantity}
        </span>
        <button
          onClick={incQuantity}
          className="h-full w-[38px] flex items-center justify-center text-[22px] leading-none cursor-pointer"
          style={{ color: "#010400" }}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

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
        <span
          className="absolute font-['Questrial:Regular',sans-serif] text-[20px] tracking-[-1px] uppercase whitespace-nowrap"
          style={{ left: 41.35, top: 31.33, color: cartHover ? "#fff" : "#000" }}
        >
          ${PRODUCT.price.toFixed(2)}
        </span>
        <span
          className="absolute -translate-x-1/2 font-['Gowun_Batang:Regular',sans-serif] text-[19.987px] tracking-[0.9994px] uppercase whitespace-nowrap"
          style={{ left: 685.85, top: 33, color: cartHover ? "#fff" : "#000" }}
        >
          add to cart
        </span>
      </button>
    </div>
  );
}
