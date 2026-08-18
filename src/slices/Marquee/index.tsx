import { FC, Fragment } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { LogoMark } from "@/components/LogoMark";
import clsx from "clsx";

/**
 * Props for `Marquee`.
 */
export type MarqueeProps = SliceComponentProps<Content.MarqueeSlice>;

/**
 * Component for "Marquee" Slices.
 */
const Marquee: FC<MarqueeProps> = ({ slice }) => {
  const MarqueeContent = () => (
    <div className="flex items-center whitespace-nowrap border-y border-white/[0.06] bg-[#111116] py-8">
      {slice.primary.phrases.map((item, i) => (
        <Fragment key={i}>
          {/* Oversized slanted text */}
          <div className="font-black-slanted px-10 text-[clamp(80px,12vw,160px)] leading-none text-[#2e2e38] uppercase [text-box:trim-both_cap_alphabetic] hover:text-[#444450] motion-safe:transition-colors motion-safe:duration-500">
            {item.text}
          </div>
          {/* Separator mark */}
          <LogoMark className="size-20 shrink-0 text-[#00d4ff]/20 md:size-28" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#111116]"
    >
      {/* Explicit height prevents layout shift */}
      <div
        className="relative flex w-full items-center overflow-hidden select-none"
        aria-hidden="true"
        role="presentation"
        style={{ height: "clamp(120px, 20vw, 240px)" }}
      >
        <div className="relative flex items-center whitespace-nowrap">
          <div
            className={clsx(
              "marquee-track animate-marquee flex",
              slice.primary.direction === "Right" &&
                "[animation-direction:reverse]",
            )}
          >
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
