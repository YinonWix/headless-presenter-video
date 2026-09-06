import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection1 from "@/imports/HeroSection3";
import HeroProducts from "@/imports/HeroSection2-1";
import HeroProductsHover from "@/imports/HeroSection2HoverOnProduct-1";

const SECTION_H = 1088;

/**
 * Home page = Hero Section 1 (top) + Hero Section 2 (product row) stacked.
 * Demo interactivity: only the middle product (Røket-9) is live. Hovering it
 * swaps the section to its hover artwork (lime tag → blue); clicking navigates
 * to the Product page. Cellu / Dermo are presentation-only.
 */
export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" style={{ width: 1920 }}>
      {/* Section 1 — hero */}
      <div className="relative" style={{ width: 1920, height: SECTION_H }}>
        <HeroSection1 />
      </div>

      {/* Section 2 — product row */}
      <div className="relative" style={{ width: 1920, height: SECTION_H }}>
        {hovered ? <HeroProductsHover /> : <HeroProducts />}

        {/* Live hotspot over the middle product (Røket-9) */}
        <button
          aria-label="View Røket-9"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => navigate("/product")}
          className="absolute cursor-pointer bg-transparent"
          style={{ left: 673, top: 277, width: 573, height: 673 }}
        />
      </div>
    </div>
  );
}
