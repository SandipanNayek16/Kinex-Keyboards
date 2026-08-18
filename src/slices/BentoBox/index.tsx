import { FC } from "react";
import { asText, Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import { FadeIn } from "@/components/FadeIn";

/**
 * Props for `BentoBox`.
 */
export type BentoBoxProps = SliceComponentProps<Content.BentoBoxSlice>;

/**
 * Component for "BentoBox" Slices.
 */
const BentoBox: FC<BentoBoxProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#0a0a0d] text-white"
    >
      {/* Section header */}
      <FadeIn className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-3 text-[#00d4ff]">Engineering</p>
          <h2
            id="features"
            className="font-black-slanted scroll-mt-20 text-[clamp(3rem,8vw,7rem)] leading-[0.85] uppercase"
          >
            <PrismicText field={slice.primary.heading} />
          </h2>
        </div>
        <div className="hidden shrink-0 items-end gap-2 pb-1 md:flex">
          <span className="label-mono text-[#2e2e38]">Mecha 16</span>
          <span className="label-mono text-[#00d4ff]">MK-01</span>
        </div>
      </FadeIn>

      <FadeIn
        targetChildren
        className="grid grid-cols-1 gap-3 md:grid-cols-6"
      >
        {slice.primary.items.map((item) => (
          <BentoBoxItem key={asText(item.text)} item={item} />
        ))}
      </FadeIn>
    </Bounded>
  );
};

export default BentoBox;

type BentoBoxItemProps = {
  item: Content.BentoBoxSliceDefaultPrimaryItemsItem;
};

function BentoBoxItem({ item }: BentoBoxItemProps) {
  return (
    <div
      className={clsx(
        "group relative min-h-64 overflow-hidden border border-white/[0.06] bg-[#111116]",
        item.size === "Small" && "md:col-span-2",
        item.size === "Medium" && "md:col-span-3",
        item.size === "Large" && "md:col-span-4",
      )}
    >
      {/* Image — only render if field is filled */}
      {isFilled.image(item.image) ? (
        <PrismicNextImage
          field={item.image}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
          quality={90}
          width={700}
        />
      ) : (
        <div className="grid-bg absolute inset-0 opacity-40" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/60 to-transparent" />



      {/* Text content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <PrismicRichText
          field={item.text}
          components={{
            paragraph: ({ children }) => (
              <p className="font-bold-slanted text-lg leading-snug text-white/90 uppercase">
                {children}
              </p>
            ),
            heading3: ({ children }) => (
              <h3 className="font-bold-slanted mb-1 text-2xl uppercase text-white">
                {children}
              </h3>
            ),
          }}
        />
      </div>
    </div>
  );
}
