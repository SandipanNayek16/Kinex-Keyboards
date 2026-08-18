import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

import { replaceBrandName } from "@/utils/text";

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
    // Removed openGraph image here to allow the dynamically generated opengraph-image.tsx to be used instead
    // of the old Prismic image which contains the "Nimbus Vapor 75" branding.
    alternates: {
      canonical: "/",
    },
  };
}
