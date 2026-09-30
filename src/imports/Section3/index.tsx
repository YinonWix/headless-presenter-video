import imgTeamLineup from "./team-lineup.avif";

/**
 * Section 3: full-bleed team line-up photo. The image is supplied pre-cropped at
 * 3840x1280 (2x of 1920x640) rather than taken from the Figma frame, whose
 * source was only 1678px wide and upscaled to fill. Drawn with object-cover, so
 * against the 638px section it loses 1px top and bottom.
 */
export default function Section3() {
  return (
    <div className="relative size-full overflow-clip" data-name="Section 3">
      <img alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" src={imgTeamLineup} />
    </div>
  );
}
