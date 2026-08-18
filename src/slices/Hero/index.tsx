"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "@/components/Loader";
import { useProgress } from "@react-three/drei";
import clsx from "clsx";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

function LoaderWrapper() {
  const { active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (active) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isLoading ? "Loading 3D scene…" : undefined}
      className={clsx(
        "pointer-events-none fixed inset-0 z-[100] motion-safe:transition-opacity motion-safe:duration-700",
        isLoading ? "opacity-100" : "opacity-0",
      )}
    >
      <Loader />
    </div>
  );
}

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".hero-heading", {
        type: "chars,lines",
        mask: "lines",
        linesClass: "line++",
      });

      const tl = gsap.timeline({ delay: 4.2 });

      tl.from(split.chars, {
        opacity: 0,
        y: -120,
        ease: "back",
        duration: 0.4,
        stagger: 0.07,
      })
        .to(".hero-body", { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(".hero-meta", { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");

      // Background transition from dark to white as user scrolls
      gsap.fromTo(
        ".hero-scene",
        {
          background:
            "linear-gradient(to bottom, #060608, #0a0a0d, #0a0f1a, #091525)",
        },
        {
          background:
            "linear-gradient(to bottom, #ffffff, #ffffff, #ffffff, #ffffff)",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "50% bottom",
            scrub: 1,
          },
        },
      );

      return () => {
        split.revert();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero-heading, .hero-body, .hero-meta", { opacity: 1 });
    });

    return () => {
      mm.revert();
    };
  });

  const scrollToExplore = () => {
    const target = document.getElementById("features");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBuy = () => {
    const target = document.getElementById("buy-button");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero relative h-dvh text-white motion-safe:h-[300vh]"
    >
      {/* Sticky 3D canvas */}
      <div className="hero-scene pointer-events-none sticky top-0 h-dvh w-full">
        <Canvas
          shadows="soft"
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Scene />
        </Canvas>
      </div>

      <LoaderWrapper />

      {/* Hero content overlay */}
      <div className="hero-content pointer-events-none absolute inset-x-0 top-0 h-dvh">
        {/* Headline — top left */}
        <div className="absolute inset-x-0 top-20 px-6 md:top-28 md:left-[8vw] md:max-w-[55vw]">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="hero-heading font-black-slanted text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight uppercase text-shadow-black/40 text-shadow-lg">
                  {children}
                </h1>
              ),
            }}
          />
        </div>

        {/* Body + CTAs — bottom right (desktop), bottom (mobile) */}
        <div className="hero-body pointer-events-auto absolute inset-x-0 bottom-8 opacity-0 md:right-[6vw] md:left-auto md:bottom-12 md:max-w-md">
          <div className="px-6 md:px-0">
            <PrismicRichText
              field={slice.primary.body}
              components={{
                heading2: ({ children }) => (
                  <h2 className="font-bold-slanted mb-3 text-3xl uppercase tracking-wide lg:text-4xl">
                    {children}
                  </h2>
                ),
                paragraph: ({ children }) => (
                  <p className="mb-5 text-base leading-relaxed text-white/70">
                    {children}
                  </p>
                ),
              }}
            />

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary — scroll to purchase */}
              <button
                onClick={scrollToBuy}
                className="font-bold-slanted group flex cursor-pointer items-center gap-2 border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-5 py-2.5 text-lg uppercase tracking-wider text-[#00d4ff] hover:bg-[#00d4ff]/20 focus:ring-2 focus:ring-[#00d4ff] focus:outline-none motion-safe:transition"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                {slice.primary.buy_button_text || "Buy Now"}
                <LuChevronRight className="size-4 group-hover:translate-x-0.5 motion-safe:transition-transform" />
              </button>

              {/* Secondary — scroll to features */}
              <button
                onClick={scrollToExplore}
                className="font-bold-slanted group flex cursor-pointer items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 text-lg uppercase tracking-wider text-white/70 hover:border-white/40 hover:text-white focus:ring-2 focus:ring-white/40 focus:outline-none motion-safe:transition"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                Explore
                <LuChevronDown className="size-4 group-hover:translate-y-0.5 motion-safe:transition-transform" />
              </button>
            </div>

            {/* Technical meta labels */}
            <div className="hero-meta mt-5 flex flex-wrap items-center gap-4 opacity-0">
              <span className="label-mono text-white/30">
                75% Layout
              </span>
              <span className="label-mono text-white/20">·</span>
              <span className="label-mono text-white/30">
                Hot-Swap
              </span>
              <span className="label-mono text-white/20">·</span>
              <span className="label-mono text-white/30">
                Gasket Mount
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
