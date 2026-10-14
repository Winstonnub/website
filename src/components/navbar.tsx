"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 -mx-6 px-6 transition-colors duration-300",
        scrolled && "border-b border-border bg-background/80 backdrop-blur-xl",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4">
        <Link
          href="/classic"
          className="mono text-sm font-medium tracking-tight transition-colors hover:text-primary"
        >
          {DATA.name.toLowerCase().replace(" ", ".")}
        </Link>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 sm:flex">
            {DATA.navbar.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mono rounded-full px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/"
            className="mono hidden rounded-full px-3 py-1.5 text-[12px] text-primary transition-colors hover:bg-card sm:inline-flex"
          >
            Cinematic
          </Link>
          <div className="mx-1 hidden h-4 w-px bg-border sm:block" />
          {Object.entries(DATA.contact.social)
            .filter(([key, social]) => social.navbar && key !== "email")
            .map(([name, social]) => {
              const Icon = social.icon;
              return (
                <a
                  key={name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          <ModeToggle className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground" />
        </div>
      </nav>
    </header>
  );
}
