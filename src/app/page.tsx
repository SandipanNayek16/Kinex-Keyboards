import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replaceBrandName(obj: any): any {
  if (typeof obj === "string") {
    return obj
      .replace(/vapor\s*75/gi, "Mecha 16")
      .replace(/Nimbus\s*Keyboards/gi, "Kinex Keyboards")
      .replace(/Nimbus/gi, "Kinex");
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceBrandName);
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = replaceBrandName(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());
  
  page.data = replaceBrandName(page.data);

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage").catch(() => notFound());

  const imageUrl = asImageSrc(page.data.meta_image) ?? undefined;

  return {
    title: replaceBrandName(page.data.meta_title) || "Mecha 16 — Kinex Keyboards",
    description:
      replaceBrandName(page.data.meta_description) ||
      "The Mecha 16 — a premium 75% gasket-mount mechanical keyboard.",
    openGraph: {
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: "Kinex Keyboards Mecha 16",
            },
          ]
        : [],
    },
    alternates: {
      canonical: "/",
    },
  };
}
