import imgBlogMark from "./blog-mark.svg";
import imgArrows from "./arrows.svg";
import imgGearBetweenUs from "./post-gear-between-us.avif";
import imgNextGenShoes from "./post-next-gen-shoes.avif";
import imgRoughGround from "./post-rough-ground.avif";

/**
 * Section 5: "The Outdoor Blog" — header, category tabs, arrows and three post
 * cards. Static for now; tabs and posts are data so filtering or a carousel can
 * be wired onto them later without restructuring.
 *
 * Only what is visible in Figma is rendered. Each card in the frame is a stack
 * of 5-8 image layers (product cut-outs, Pantone shots, etc.), but every stack
 * is fully covered by its top photo, so those layers are left out. They remain
 * in the Figma file if a hover-reveal behaviour ever needs them.
 *
 * Positions are Figma's, section-relative. The frame is 1923px wide in Figma,
 * but nothing sits past x=1856, so it renders inside the usual 1920 stage.
 */

type Tag = { label: string; className?: string };

type Post = {
  id: string;
  /** Left edge of the image card. */
  x: number;
  image: { src: string; className: string };
  tags: { left: number; top: number; bg: string; items: Tag[] };
  meta:
    | { kind: "product"; name: string; nameLeft: number; price: string; priceLeft: number }
    | { kind: "date"; date: string };
  title: string[];
  titleClassName: string;
  body: string[];
  bodyTop: number;
  /** Left edge of the title / body / "Read more" column. */
  textLeft: number;
};

const TAG_TEXT = "text-[#1c1d21] tracking-[-0.3px]";

const POSTS: Post[] = [
  {
    id: "gear-between-us",
    x: 72,
    image: { src: imgGearBetweenUs, className: "left-[-149.98px] top-[-474.09px] h-[1527px] w-[853px] object-cover" },
    tags: {
      left: 39.01,
      top: 20,
      bg: "bg-[rgba(229,251,121,0.5)]",
      items: [{ label: "PEOPLE" }, { label: "GEAR GUIDE" }],
    },
    meta: { kind: "product", name: "Runnet", nameLeft: 4.75, price: "$180", priceLeft: 508.86 },
    title: ["The Gear Between Us"],
    titleClassName: "leading-[normal] text-black",
    body: ["How the right equipment can turn a simple hike ", "into something bigger."],
    bodyTop: 1101,
    textLeft: 77.01,
  },
  {
    id: "next-gen-shoes",
    x: 673.02,
    image: { src: imgNextGenShoes, className: "left-[-51.92%] top-0 h-full w-[203.83%]" },
    tags: {
      left: 13.96,
      top: 18.08,
      bg: "bg-[rgba(229,251,121,0.4)]",
      items: [
        // Figma draws this one pure black without the -0.3px tracking.
        { label: "GEAR GUIDE", className: "text-black" },
        { label: "SUSTAINABLE MATERIALS ", className: TAG_TEXT },
      ],
    },
    meta: { kind: "date", date: "APR 12, 2025" },
    title: ["Next-Generation Shoes", "For Next Gen-Hikers"],
    // Figma's 108.93% line height (43.57px) is laid out as whole 44px lines.
    titleClassName: "leading-[44px] text-[#1c1d21]",
    body: ["We engineer high-performance active-urban ", "design that transforms how you walk in this world. "],
    bodyTop: 1139,
    textLeft: 678,
  },
  {
    id: "rough-ground",
    x: 1273,
    // Figma applies a -28% saturation adjustment to this image fill.
    image: { src: imgRoughGround, className: "left-0 top-[-0.27px] h-[653px] w-[574px] object-cover saturate-[0.72]" },
    tags: {
      left: 15.98,
      top: 17.99,
      bg: "bg-[rgba(229,251,121,0.5)]",
      items: [{ label: "GEAR GUIDE" }, { label: "TRAILS" }],
    },
    meta: { kind: "product", name: "Dermo", nameLeft: 4.49, price: "$275", priceLeft: 519.73 },
    title: ["Built for Rough Ground"],
    titleClassName: "leading-[normal] text-black",
    body: ["A closer look at the materials, technology and design ", "details that keep you moving, anywhere."],
    bodyTop: 1101,
    textLeft: 1277,
  },
];

/** Category tabs; `left` is each label's Figma x. "All" sits on the black pill. */
const TABS = [
  { label: "All", left: 999 },
  { label: "Gear Guides", left: 1066 },
  { label: "Trails", left: 1209 },
  { label: "people", left: 1299 },
  { label: "sustainability", left: 1394 },
  { label: "behind the design", left: 1559 },
];
const ACTIVE_TAB = "All";

const CARD_TOP = 298;
const QUESTRIAL = "font-['Questrial:Regular',sans-serif] not-italic";
const GOWUN = "font-['Gowun_Batang:Regular',sans-serif] not-italic";

function PostCard({ post }: { post: Post }) {
  const { x, image, tags, meta } = post;
  return (
    <article>
      {/* Image card */}
      <div className="absolute h-[653px] w-[574px] overflow-clip rounded-[20px] bg-white" style={{ left: x, top: CARD_TOP }}>
        <img alt="" className={`pointer-events-none absolute max-w-none ${image.className}`} src={image.src} />
        <ul className="absolute flex items-center gap-[8px]" style={{ left: tags.left, top: tags.top }}>
          {tags.items.map((tag) => (
            <li key={tag.label} className={`flex items-center justify-center rounded-[16px] py-[12px] pl-[12px] pr-[16px] ${tags.bg}`}>
              <span className={`${QUESTRIAL} whitespace-pre text-[14px] leading-[normal] ${tag.className ?? TAG_TEXT}`}>{tag.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product name + price, or date, under the card */}
      {meta.kind === "product" ? (
        <>
          <p className={`${QUESTRIAL} absolute whitespace-nowrap text-[29.695px] leading-[normal] text-[#1c1d21]`} style={{ left: x + meta.nameLeft, top: 970.27 }}>
            {meta.name}
          </p>
          <p className={`${QUESTRIAL} absolute whitespace-nowrap text-[22.271px] leading-[normal] text-[#1c1d21]`} style={{ left: x + meta.priceLeft, top: 979.38 }}>
            {meta.price}
          </p>
        </>
      ) : (
        <p className={`${QUESTRIAL} absolute whitespace-nowrap text-[20px] leading-[normal] text-[#1c1d21]`} style={{ left: x + 5, top: 983 }}>
          {meta.date}
        </p>
      )}

      <h3 className={`${GOWUN} absolute top-[1030px] w-[578px] text-[40px] font-normal ${post.titleClassName}`} style={{ left: post.textLeft }}>
        {post.title.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>

      <p className={`${QUESTRIAL} absolute whitespace-pre text-[20px] leading-[1.3] text-black`} style={{ left: post.textLeft, top: post.bodyTop }}>
        {post.body.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className={`${QUESTRIAL} absolute top-[1221px] whitespace-pre text-[15px] leading-[normal] text-[#1c1d21] underline decoration-solid decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:none]`}
        style={{ left: post.textLeft }}
      >
        {"READ MORE >"}
      </a>
    </article>
  );
}

export default function Section5() {
  return (
    <section className="relative size-full overflow-clip bg-white" data-name="Section 5">
      <img alt="" className="absolute left-[72px] top-[69px] block max-w-none" width="51.9997" height="50.9965" src={imgBlogMark} />

      <h2 className="absolute left-[72px] top-[139px] w-[737px] font-['Gowun_Batang:Bold',sans-serif] text-[66.305px] font-normal not-italic leading-[1.0893] text-[#1c1d21]">
        The Outdoor Blog
      </h2>
      <p className={`${GOWUN} absolute left-[75px] top-[214px] w-[578px] text-[28px] leading-[1.089] text-[#1c1d21]`}>
        Stories, gear and ideas made for the outdoors.
      </p>

      {/* Category tabs */}
      <div className="absolute left-[988px] top-[215px] h-[27px] w-[50px] rounded-[13px] bg-black" />
      <nav aria-label="Blog categories">
        {TABS.map((tab) => (
          <a
            key={tab.label}
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-current={tab.label === ACTIVE_TAB ? "page" : undefined}
            className={`${QUESTRIAL} absolute top-[218px] whitespace-nowrap text-[17.198px] uppercase leading-[21.855px] ${
              tab.label === ACTIVE_TAB ? "text-white" : "text-[#1c1d21]"
            }`}
            style={{ left: tab.left }}
          >
            {tab.label}
          </a>
        ))}
      </nav>

      {/* Previous / next arrows (one Figma group; split into two buttons once they do something) */}
      <img alt="" className="absolute left-[1765.74px] top-[206px] block max-w-none" width="89.5805" height="45.1806" src={imgArrows} />

      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
