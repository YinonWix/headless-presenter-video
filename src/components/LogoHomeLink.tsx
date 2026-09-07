import { useNavigate } from "react-router-dom";

/**
 * Click target over the SOLE (+) DROP header mark, returning to the home page.
 *
 * The logo itself is drawn by the Figma frames (`Group9` + `Group21` on the
 * product page, `Group11` + `Group31` on checkout), so this overlay only adds
 * the hit area -- it paints nothing. The box is the union of the two parts'
 * measured rects, which are identical on both pages:
 *
 *   spiral mark   73.906, 63.75   172.625 x 64.422
 *   wordmark     259.234, 56      146.844 x 37
 *
 * unioning to 73.906, 56, 332.172 x 72.172. Kept in one component so the two
 * pages cannot drift apart.
 */
export default function LogoHomeLink() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="absolute cursor-pointer bg-transparent"
      style={{ left: 73.906, top: 56, width: 332.172, height: 72.172 }}
      aria-label="SOLE DROP — go to home page"
    />
  );
}
