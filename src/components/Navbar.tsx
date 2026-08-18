"use client";

import { useRef, useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { LuChevronRight, LuMenu, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Logo } from "./Logo";
import clsx from "clsx";

const DialogContext = createContext<
  [open: boolean, setOpen: (open: boolean) => void]
>([false, () => {}]);

const NAV_LINKS = [
  { href: "#features", title: "Features", description: "Engineering & build quality" },
  { href: "#switch-playground", title: "Switches", description: "Feel your perfect switch" },
  { href: "#keycap-changer", title: "Keycaps", description: "Choose your colourway" },
  { href: "#buy-button", title: "Purchase", description: "Order the Mecha 16" },
] as const;

export function Navbar() {
  const state = useState(false);
  const [open, setOpen] = state;

  // Scroll-state for blur/glass effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 motion-safe:transition-all motion-safe:duration-300",
        scrolled
          ? "glass-surface border-b border-white/[0.06]"
          : "bg-transparent",
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="shrink-0 hover:opacity-80 motion-safe:transition-opacity"
        aria-label="Kinex Keyboards — home"
      >
        <Logo className="h-6 w-auto md:h-7" />
      </Link>

      {/* Desktop nav links */}
      <nav className="hidden items-center gap-6 md:flex" aria-label="Site navigation">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="label-mono text-[#aaabb8] hover:text-[#00d4ff] motion-safe:transition-colors"
          >
            {link.title}
          </a>
        ))}
      </nav>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Buy CTA */}
        <a
          href="#buy-button"
          id="navbar-buy-btn"
          aria-label="Buy Mecha 16 keyboard"
          className={clsx(
            "group relative flex h-10 cursor-pointer items-center justify-center overflow-hidden px-5 py-2 font-semibold text-white focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black focus:outline-none motion-safe:transition-all motion-safe:duration-300",
            "border border-[#00d4ff]/40 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/70",
          )}
          style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
        >
          <span className="font-bold-slanted relative z-10 flex items-center gap-1.5 text-sm uppercase tracking-wider text-[#00d4ff]">
            Buy
            <LuChevronRight className="size-4 group-hover:translate-x-0.5 motion-safe:transition-transform" />
          </span>
        </a>

        {/* Mobile menu trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            aria-label="Open navigation menu"
            className="flex size-10 cursor-pointer items-center justify-center border border-white/10 bg-white/5 text-[#aaabb8] hover:border-white/20 hover:text-white motion-safe:transition md:hidden"
            style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
          >
            <LuMenu className="size-4" />
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
            <DialogContent
              aria-describedby="mobile-nav-desc"
              className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 h-full w-[min(80vw,320px)] border-l border-white/[0.06] bg-[#0a0a0d] p-6 shadow-2xl shadow-black/60 ease-in-out motion-safe:transition motion-safe:data-[state=closed]:duration-300 motion-safe:data-[state=open]:duration-500"
            >
              <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
              <DialogDescription id="mobile-nav-desc" className="sr-only">
                Navigate to different sections of the Kinex Keyboards page
              </DialogDescription>

              {/* Drawer header */}
              <div className="mb-8 flex items-center justify-between">
                <Logo className="h-5 w-auto" />
                <DialogClose
                  aria-label="Close navigation menu"
                  className="flex size-9 cursor-pointer items-center justify-center text-[#8a8a9a] hover:text-white motion-safe:transition"
                >
                  <LuX className="size-4" />
                </DialogClose>
              </div>

              {/* Technical label */}
              <p className="label-mono mb-4 text-[#8a8a9a]">Navigation</p>

              <DialogContext.Provider value={state}>
                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <MobileNavLink
                        key={link.href}
                        href={link.href}
                        title={link.title}
                        description={link.description}
                      />
                    ))}
                  </ul>
                </nav>
              </DialogContext.Provider>

              {/* Mobile buy button */}
              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <a
                  href="#buy-button"
                  onClick={() => setOpen(false)}
                  className="font-bold-slanted flex w-full cursor-pointer items-center justify-center gap-2 border border-[#00d4ff]/40 bg-[#00d4ff]/10 py-3 text-base uppercase tracking-wider text-[#00d4ff] hover:bg-[#00d4ff]/20 motion-safe:transition"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  Buy Mecha 16
                  <LuChevronRight className="size-4" />
                </a>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </header>
  );
}

type MobileNavLinkProps = {
  href: string;
  title: string;
  description: string;
};

function MobileNavLink({ href, title, description }: MobileNavLinkProps) {
  const [, setOpen] = useContext(DialogContext);

  return (
    <li>
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="group flex items-center rounded-sm px-3 py-3 hover:bg-white/[0.04] focus:bg-white/[0.04] focus:outline-none motion-safe:transition"
      >
        <div className="flex grow flex-col gap-0.5">
          <span className="font-bold-slanted text-lg uppercase text-white/90 group-hover:text-[#00d4ff] motion-safe:transition-colors">
            {title}
          </span>
          <span className="label-mono text-[#555560]">{description}</span>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center text-[#555560] group-hover:text-[#00d4ff] motion-safe:transition-colors">
          <LuChevronRight className="size-4 translate-x-px" />
        </div>
      </Link>
    </li>
  );
}
