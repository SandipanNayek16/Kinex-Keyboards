"use client";

import { FC, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { LuChevronRight, LuLoader } from "react-icons/lu";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { checkout } from "@/checkout";

gsap.registerPlugin(useGSAP);

/**
 * Props for `PurchaseButton`.
 */
export type PurchaseButtonProps =
  SliceComponentProps<Content.PurchaseButtonSlice>;

/**
 * Component for "PurchaseButton" Slices.
 */
const PurchaseButton: FC<PurchaseButtonProps> = ({ slice }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchaseClick = async () => {
    if (isPressed) return;
    setIsPressed(true);
    setErrorMessage(null);

    // Attempt to resolve dynamic product UID from CMS, fallback to legacy ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productUid = (slice.primary as any).product?.uid || "vapor75";
    const result = await checkout(productUid);
    setIsPressed(false);

    if (!result.success) {
      setErrorMessage(result.error);
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  useGSAP(() => {
    if (!buttonRef.current || !textRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!buttonRef.current || !textRef.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const mouseX = event.clientX - buttonRect.left;
      const buttonWidth = buttonRect.width;
      const normalizedX = Math.max(0, Math.min(1, mouseX / buttonWidth));

      const newWdth = 120 - normalizedX * 70;
      const newWght = 700 + normalizedX * 300;

      gsap.to(textRef.current, {
        "--wdth": newWdth,
        "--wght": newWght,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!textRef.current) return;
      gsap.to(textRef.current, {
        "--wdth": 85,
        "--wght": 850,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const btn = buttonRef.current;
    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    gsap.set(textRef.current, { "--wdth": 85, "--wght": 850 });

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#f5f5f7] text-[#0a0a0d]"
    >
      <FadeIn className="mx-auto max-w-7xl text-center" targetChildren>
        {/* Eyebrow */}
        <p className="label-mono mb-4 text-[#8a8a9a]">
          {slice.primary.eyebrow}
        </p>

        {/* Section heading */}
        <h2
          id="buy-button"
          className="font-bold-slanted mb-10 scroll-mt-20 text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] text-[#0a0a0d] uppercase"
        >
          <PrismicText field={slice.primary.heading} />
        </h2>

        {/* Main CTA button */}
        <button
          ref={buttonRef}
          id="purchase-cta-btn"
          onClick={handlePurchaseClick}
          disabled={isPressed}
          aria-busy={isPressed}
          aria-label="Purchase Kinex Mecha 16 keyboard"
          className={clsx(
            "group relative w-full overflow-hidden border-4 border-[#0a0a0d] bg-gradient-to-r from-sky-400 to-sky-600 px-8 py-8 focus:ring-4 focus:ring-sky-500/50 focus:outline-none motion-safe:transition-all motion-safe:duration-300 md:border-8 md:px-20 md:py-16",
            "hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/30",
            "active:scale-[0.98]",
            isPressed ? "cursor-not-allowed opacity-80" : "cursor-pointer",
          )}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent ease-out group-hover:translate-x-full motion-safe:transition-transform motion-safe:duration-1000" />

          <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8">
            <span
              ref={textRef}
              style={{ "--wdth": 85, "--wght": 850 } as React.CSSProperties}
              className="font-black-slanted text-[clamp(2rem,7vw,6rem)] tracking-wide text-[#0a0a0d] uppercase group-hover:-translate-y-1 motion-safe:transition-transform motion-safe:duration-300"
            >
              {isPressed ? (
                <span className="flex items-center gap-3 md:gap-5">
                  <LuLoader className="size-10 animate-spin md:size-14" />
                  Connecting…
                </span>
              ) : (
                slice.primary.button_text
              )}
            </span>

            {!isPressed && (
              <div className="hidden group-hover:translate-x-2 group-hover:scale-110 motion-safe:transition-all motion-safe:duration-300 md:block">
                <LuChevronRight className="size-12 text-[#0a0a0d] md:size-16" />
              </div>
            )}
          </div>
        </button>

        {/* Error message */}
        {errorMessage && (
          <p
            role="alert"
            className="mt-4 text-base font-semibold text-red-600"
          >
            {errorMessage}
          </p>
        )}

        {/* Supporting copy */}
        <div className="mt-10 space-y-2 text-sm text-[#8a8a9a] md:text-base">
          <PrismicRichText field={slice.primary.body} />
        </div>
      </FadeIn>
    </Bounded>
  );
};

export default PurchaseButton;
