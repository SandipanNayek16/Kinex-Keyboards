import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const FOOTER_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#switch-playground", label: "Switches" },
  { href: "#keycap-changer", label: "Keycaps" },
  { href: "#buy-button", label: "Purchase" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060608] px-6 py-12 text-[#555560] md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Top row */}
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
            href="/"
            aria-label="Kinex Keyboards — home"
          >
            <Logo className="h-7 w-auto opacity-80" />
          </Link>
            <p className="label-mono text-[#2e2e38]">
              Precision. Modularity. Tactility.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-white/[0.04]" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="label-mono text-[#2e2e38]">
            © {new Date().getFullYear()} Kinex Keyboards — All rights reserved
          </p>
          <div className="flex items-center gap-1">
            <span className="label-mono text-[#2e2e38]">Built for</span>
            <span className="label-mono text-[#00d4ff]">precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkProps = {
  href: string;
  children: ReactNode;
};

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="label-mono text-[#2e2e38] hover:text-[#00d4ff] motion-safe:transition-colors focus:text-[#00d4ff] focus:outline-none"
    >
      {children}
    </a>
  );
}
