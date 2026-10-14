import Link from "next/link";
import { ArrowDownRight, MapPin } from "lucide-react";
import HeroScene from "@/components/three/hero-scene";
import { DATA } from "@/data/resume";
import { EmailButton } from "@/components/email-button";

export default function HeroSection() {
  return (
    <section id="hero" className="pb-12 pt-10 sm:pt-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DATA.avatarUrl}
              alt={DATA.name}
              className="size-10 rounded-full border border-border object-cover ring-2 ring-primary/20"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              <span className="mono text-[11px] text-muted-foreground">
                {DATA.role}
              </span>
            </span>
            <span className="mono inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              {DATA.location}
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{DATA.tagline}</span>
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            {DATA.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              See the work
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <EmailButton
              label="Get in touch"
              className="border border-border bg-transparent text-foreground hover:bg-card"
            />

          </div>
        </div>

        <HeroScene />

      </div>
    </section>
  );
}
