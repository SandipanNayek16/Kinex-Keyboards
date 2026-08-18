import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth", "slnt", "opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kinex-keyboards.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kinex Keyboards — Mecha 16 Mechanical Keyboard",
    template: "%s | Kinex Keyboards",
  },
  description:
    "The Mecha 16 — a premium 75% gasket-mount mechanical keyboard with hot-swap sockets, OLED display, and bespoke keycap colourways. Engineered for precision.",
  keywords: [
    "mechanical keyboard",
    "Mecha 16",
    "75% keyboard",
    "hot-swap",
    "gasket mount",
    "Kinex Keyboards",
  ],
  authors: [{ name: "Kinex Keyboards" }],
  creator: "Kinex Keyboards",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Kinex Keyboards",
    title: "Kinex Keyboards — Mecha 16 Mechanical Keyboard",
    description:
      "A premium 75% gasket-mount keyboard with hot-swap sockets, OLED display, and bespoke keycap colourways.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinex Keyboards — Mecha 16",
    description: "Premium 75% mechanical keyboard. Engineered for precision.",
    creator: "@KinexKeyboards",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoFlex.variable} bg-cyan-50 antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
