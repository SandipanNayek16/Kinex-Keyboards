"use client";

import { FC, useRef } from "react";
import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { SOUND_MAP, Switch } from "@/components/Switch";
import { Stage } from "@react-three/drei";
import gsap from "gsap";
import { LuVolume2 } from "react-icons/lu";

/**
 * Props for `SwitchPlayground`
 */
export type SwitchPlaygroundProps =
  SliceComponentProps<Content.SwitchPlaygroundSlice>;

/**
 * Component for "SwitchPlayground" Slices.
 */
const SwitchPlayground: FC<SwitchPlaygroundProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#0a0a0d] text-white"
    >
      <FadeIn>
        {/* Section header */}
        <div className="mb-10">
          <p className="label-mono mb-3 text-[#00d4ff]">Tactile Feel</p>
          <h2
            id="switch-playground"
            className="font-black-slanted scroll-mt-20 text-[clamp(3rem,8vw,7rem)] leading-[0.85] uppercase"
          >
            <PrismicText field={slice.primary.heading} />
          </h2>
          <div className="mt-4 max-w-2xl text-base leading-relaxed text-[#8a8a9a]">
            <PrismicRichText field={slice.primary.description} />
          </div>
        </div>

        {/* Switch cards grid */}
        <FadeIn
          targetChildren
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {slice.primary.switches.map((item) =>
            isFilled.contentRelationship(item.switch) ? (
              <SwitchCard key={item.switch.id} color={item.switch} />
            ) : null,
          )}
        </FadeIn>
      </FadeIn>
    </Bounded>
  );
};

export default SwitchPlayground;

type SwitchCardProps = {
  color: Content.SwitchPlaygroundSliceDefaultPrimarySwitchesItem["switch"];
};

const SwitchCard = ({ color }: SwitchCardProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isFilled.contentRelationship(color) || !color.data) return null;

  const colorName = color.uid as "red" | "brown" | "blue" | "black";
  const { color: hexColor, name } = color.data;

  // Background treatment per switch type
  const bgAccent = {
    blue: { ring: "#00d4ff", bg: "#00d4ff12", dark: "#020d12" },
    red: { ring: "#ff4444", bg: "#ff444412", dark: "#120202" },
    brown: { ring: "#c87941", bg: "#c8794112", dark: "#110b02" },
    black: { ring: "#8a8a9a", bg: "#8a8a9a10", dark: "#080808" },
  }[colorName];

  const handleSound = () => {
    const selected = gsap.utils.random(SOUND_MAP[colorName]);
    const audio = new Audio(selected);
    audio.volume = 0.6;
    audioRef.current = audio;
    try {
      const p = audio.play();
      if (p !== undefined) p.catch(() => {});
    } catch {
      /* autoplay blocked — silent fail */
    }
  };

  const switchTypeLabel = {
    red: "Linear",
    brown: "Tactile",
    blue: "Clicky",
    black: "Linear Heavy",
  }[colorName];

  return (
    <div
      className="group relative overflow-hidden select-none"
      style={{
        background: bgAccent.dark,
        border: `1px solid ${bgAccent.ring}20`,
      }}
    >
      {/* Top meta bar */}
      <div
        className="flex items-center justify-between border-b px-5 py-3"
        style={{ borderColor: `${bgAccent.ring}20` }}
      >
        <div className="flex items-center gap-3">
          {/* Color dot */}
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: hexColor || bgAccent.ring }}
          />
          <span className="font-bold-slanted text-base uppercase tracking-wide text-white">
            {name}
          </span>
        </div>
        <span className="label-mono" style={{ color: bgAccent.ring }}>
          {switchTypeLabel}
        </span>
      </div>

      {/* 3D canvas */}
      <div className="relative h-64 md:h-72" aria-hidden="true">
        <Canvas camera={{ position: [1.5, 2, 0], fov: 7 }}>
          <Stage
            adjustCamera
            intensity={0.5}
            shadows="contact"
            environment="city"
          >
            <Switch
              rotation={[0, Math.PI / 4, 0]}
              color={colorName}
              hexColor={hexColor || ""}
            />
          </Stage>
        </Canvas>

        {/* Background text pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-20 mix-blend-overlay"
          viewBox="0 0 75 100"
          aria-hidden="true"
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={18}
            className="font-black-slanted fill-white uppercase group-hover:fill-white/80 motion-safe:transition-all motion-safe:duration-700"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -40 : 14}>
                {colorName}
                {colorName}
                {colorName}
              </tspan>
            ))}
          </text>
        </svg>
      </div>

      {/* Bottom controls */}
      <div
        className="flex items-center justify-between border-t px-5 py-4"
        style={{ borderColor: `${bgAccent.ring}20` }}
      >
        {/* Press instruction */}
        <p className="label-mono text-[#555560]">Click model to feel</p>

        {/* Sound button */}
        <button
          onClick={handleSound}
          aria-label={`Play ${name} switch sound sample`}
          className={clsx(
            "flex items-center gap-2 border px-3 py-2 text-sm font-semibold motion-safe:transition hover:opacity-80 focus:outline-none",
          )}
          style={{
            borderColor: `${bgAccent.ring}40`,
            color: bgAccent.ring,
            background: bgAccent.bg,
            clipPath:
              "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
            outlineColor: bgAccent.ring,
          }}
        >
          <LuVolume2 className="size-4" />
          <span className="label-mono">Sound</span>
        </button>
      </div>
    </div>
  );
};
