import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "@/imports/CheckoutPage-1";
import QuantityStepper from "@/components/QuantityStepper";
import LogoHomeLink from "@/components/LogoHomeLink";
import { PRODUCT, useCart } from "@/store/CartContext";

const LIME = "#e5fb79";
const BLUE = "#116dff";

/**
 * Cart page. The Figma checkout frame renders underneath; live overlays sit at
 * the frame's coordinates. Quantity + size are read from the cart context (set on
 * the Product page). The line total and subtotal recompute as quantity × price.
 * Checkout is a hover→blue dead-end (simulated press, no navigation), and
 * Keep Shopping is presentation-only.
 */
export default function Cart() {
  const navigate = useNavigate();
  const { size, quantity, incQuantity, decQuantity, subtotal } = useCart();
  const [checkoutHover, setCheckoutHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const money = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="relative" style={{ width: 1920, height: 1088 }}>
      <CheckoutPage />

      {/* Header mark -> home. Hit area only; the frame draws the logo. */}
      <LogoHomeLink />

      {/* Selected size (carried from the Product page) */}
      <p
        className="absolute font-['Questrial:Regular',sans-serif] text-[18px] uppercase tracking-[0.5px]"
        style={{ left: 532, top: 690, color: "#a7a8a8" }}
      >
        Size: {size}
      </p>

      {/* Line-item quantity stepper. Same component as the Product page, at the
          larger size CheckoutPage-1 draws: container 153×62 at 532,735 with a
          0.9px stroke, dividers at +54 and +101. */}
      <QuantityStepper
        quantity={quantity}
        onDec={decQuantity}
        onInc={incQuantity}
        left={532}
        top={735}
        width={153}
        height={62}
        radius={12}
        borderWidth={0.9}
        cells={[54, 47, 52]}
        dividerWidth={0.9}
        dividerInsetTop={4}
        dividerInsetBottom={3}
        glyph={14}
        glyphStroke={2}
        fontSize={21}
      />

      {/* Line-item total (replaces the emptied placeholder in CheckoutPage-1) */}
      <p
        className="absolute -translate-x-1/2 font-['Gowun_Batang:Regular',sans-serif] text-[22.008px] uppercase whitespace-nowrap text-center"
        style={{ left: 1339.5, top: 348, color: "#000" }}
      >
        {money(quantity * PRODUCT.price)}
      </p>

      {/* Subtotal value (replaces the emptied placeholder in CheckoutPage-1) */}
      <p
        className="absolute font-['Questrial:Regular',sans-serif] text-[31px] whitespace-nowrap"
        style={{ left: 1698, top: 416, color: "#000" }}
      >
        {money(subtotal)}
      </p>

      {/* Checkout — hover→blue, dead-end (no navigation) */}
      <button
        onMouseEnter={() => setCheckoutHover(true)}
        onMouseLeave={() => {
          setCheckoutHover(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className="absolute cursor-pointer transition-transform"
        style={{
          left: 1482,
          top: 674,
          width: 344,
          height: 66,
          borderRadius: 8.328,
          border: "0.5px solid #aeaeae",
          background: checkoutHover ? BLUE : LIME,
          transform: pressed ? "scale(0.98)" : "scale(1)",
        }}
      >
        <span
          className="font-['Gowun_Batang:Regular',sans-serif] text-[19.987px] tracking-[0.9994px] uppercase"
          style={{ color: checkoutHover ? "#fff" : "#000" }}
        >
          Checkout
        </span>
      </button>

      {/* Keep Shopping — presentation only, returns to catalog */}
      <button
        onClick={() => navigate("/")}
        className="absolute cursor-pointer bg-transparent"
        style={{ left: 1482, top: 740, width: 344, height: 66 }}
        aria-label="Keep shopping"
      />
    </div>
  );
}
