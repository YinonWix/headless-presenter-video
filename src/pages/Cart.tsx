import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutPage from "@/imports/CheckoutPage-1";
import QuantityStepper from "@/components/QuantityStepper";
import LogoHomeLink from "@/components/LogoHomeLink";
import { PRODUCT, useCart } from "@/store/CartContext";

const LIME = "#e5fb79";
const BLUE = "#116dff";

/* Right edge of the last dot's *ink* in the summary card's dotted rule, in the
   frame's own 1920-wide coordinates. The frame's "Subtotal" label is placed at
   1482 against a rule whose ink starts at 1481.88, i.e. it's flush with the
   first dot rather than with the text box -- so the mirror-image anchor for the
   value on the right is the last dot's ink, not the rule's box (1822.289).

   The rule is 56 periods in `Helvetica Neue:Regular`, which has no @font-face
   and so resolves through the stack's `sans-serif` fallback. That is safe to
   measure against: Helvetica, Arial and Liberation Sans all give the period an
   advance of 278/1000 em, the same as real Helvetica Neue, so the rule ends at
   the same x on macOS, Windows and Figma alike. */
const RULE_INK_RIGHT = 1820.302;

/* The value's own right side bearing, subtracted so *its* ink -- not its text
   box -- lands on the anchor. Constant across quantities: the string always
   ends in "0", since the price is a whole number of dollars. */
const PRICE_RIGHT_BEARING = 1.333;

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

      {/* Subtotal value (replaces the emptied placeholder in CheckoutPage-1).
          Right-aligned to the dotted rule below it, mirroring how the frame's
          "Subtotal" label sits flush with the rule's left end. translateX pulls
          the box left by its own width, so `left` acts as its right edge --
          which keeps the value anchored as the quantity changes its width. */}
      <p
        className="absolute font-['Questrial:Regular',sans-serif] text-[31px] whitespace-nowrap"
        style={{
          left: RULE_INK_RIGHT + PRICE_RIGHT_BEARING,
          top: 416,
          transform: "translateX(-100%)",
          color: "#000",
        }}
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
