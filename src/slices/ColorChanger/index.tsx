"use client";

import { FC, useCallback, useState } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import clsx from "clsx";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { LuCheck } from "react-icons/lu";

export const KEYCAP_TEXTURES = [
  {
    id: "goodwell",
    name: "Goodwell",
    path: "/goodwell_uv.png",
    knobColor: "#2A2A2E",
    bgColor: "#1a1a20",
  },
  {
    id: "dreamboard",
    name: "Dreamboard",
    path: "/dreamboard_uv.png",
    knobColor: "#b06070",
    bgColor: "#2a151b",
  },
  {
    id: "cherrynavy",
    name: "Cherry Navy",
    path: "/cherrynavy_uv.png",
    knobColor: "#4050a0",
    bgColor: "#0a1228",
  },
  { 
    id: "kick", 
    name: "Kick", 
    path: "/kick_uv.png", 
    knobColor: "#cc2020",
    bgColor: "#330808",
  },
  {
    id: "oldschool",
    name: "Old School",
    path: "/oldschool_uv.png",
    knobColor: "#8a7060",
    bgColor: "#2a221b",
  },
  {
    id: "candykeys",
    name: "Candy Keys",
    path: "/candykeys_uv.png",
    knobColor: "#c06080",
    bgColor: "#331522",
  },
] as const;

type KeycapTexture = (typeof KEYCAP_TEXTURES)[number];

/**
 * Props for `ColorChanger`.
 */
export type ColorChangerProps = SliceComponentProps<Content.ColorChangerSlice>;

/**
 * Component for "ColorChanger" Slices.
 */
const ColorChanger: FC<ColorChangerProps> = ({ slice }) => {
  const [selectedTextureId, setSelectedTextureId] = useState<string>(
    KEYCAP_TEXTURES[0].id,
  );
  const [backgroundText, setBackgroundText] = useState<string>(
    KEYCAP_TEXTURES[0].name,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  function handleTextureSelect(texture: KeycapTexture) {
    if (texture.id === selectedTextureId || isAnimating) return;
    setIsAnimating(true);
    setSelectedTextureId(texture.id);
    setBackgroundText(texture.name);
  }

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const activeTexture =
    KEYCAP_TEXTURES.find((t) => t.id === selectedTextureId) || KEYCAP_TEXTURES[0];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="keycap-changer"
      className="relative flex flex-col overflow-hidden text-white motion-safe:transition-colors motion-safe:duration-700"
      style={{ backgroundColor: activeTexture.bgColor }}
    >
      {/* Background repeating text */}
      <svg
        className="pointer-events-none absolute top-0 left-0 h-auto w-full opacity-[0.05]"
        viewBox="0 0 75 100"
        aria-hidden="true"
      >
        <text
          fontSize={7}
          textAnchor="middle"
          dominantBaseline="middle"
          x="50%"
          y="50%"
          className="font-black-slanted fill-white uppercase"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -50 : 6}>
              {Array.from({ length: 10 }, () => backgroundText).join(" ")}
            </tspan>
          ))}
        </text>
      </svg>

      {/* 3D Canvas — adaptive height, not fixed */}
      <div className="relative h-[50vw] min-h-[260px] max-h-[520px] w-full shrink-0">
        <Canvas
          camera={{ position: [0, 0.5, 0.5], fov: 45, zoom: 1.5 }}
          className="h-full w-full"
        >
          <Scene
            selectedTextureId={selectedTextureId}
            onAnimationComplete={handleAnimationComplete}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <Bounded className="relative shrink-0 border-t border-white/[0.06]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Text */}
          <div className="shrink-0 lg:max-w-xs">
            <p className="label-mono mb-3 text-[#00d4ff]">Customise</p>
            <h2 className="font-black-slanted mb-4 text-4xl uppercase leading-[0.9] md:text-5xl">
              <PrismicText field={slice.primary.heading} />
            </h2>
            <div className="text-sm leading-relaxed text-white/70">
              <PrismicRichText field={slice.primary.description} />
            </div>
          </div>

          {/* Texture selector */}
          <div className="grow">
            <p className="label-mono mb-4 text-white/50">Select Colourway</p>
            <ul
              className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6"
              role="radiogroup"
              aria-label="Keycap colourway selector"
            >
              {KEYCAP_TEXTURES.map((texture) => {
                const isSelected = selectedTextureId === texture.id;
                return (
                  <li key={texture.id}>
                    <button
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleTextureSelect(texture)}
                      disabled={isAnimating && !isSelected}
                      title={texture.name}
                      className={clsx(
                        "relative flex w-full flex-col items-center gap-2 border p-3 focus:ring-2 focus:ring-[#00d4ff] focus:outline-none motion-safe:transition-all motion-safe:duration-200",
                        isSelected
                          ? "border-[#00d4ff] bg-[#00d4ff]/10"
                          : "cursor-pointer border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                        isAnimating && !isSelected && "cursor-not-allowed opacity-40",
                      )}
                    >
                      {/* Active indicator — not color alone */}
                      {isSelected && (
                        <span className="keycap-active-indicator" aria-hidden="true" />
                      )}

                      {/* Texture preview */}
                      <div className="overflow-hidden border border-white/10">
                        <Image
                          src={texture.path}
                          alt={`${texture.name} keycap colourway preview`}
                          width={80}
                          height={52}
                          className="h-12 w-full object-cover"
                        />
                      </div>

                      {/* Name */}
                      <span
                        className={clsx(
                          "label-mono text-center text-[10px]",
                          isSelected ? "text-[#00d4ff]" : "text-white/50",
                        )}
                      >
                        {texture.name}
                      </span>

                      {/* Check icon for active state (accessible, not color-only) */}
                      {isSelected && (
                        <LuCheck
                          className="size-3 text-[#00d4ff]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Bounded>
    </section>
  );
};

export default ColorChanger;
