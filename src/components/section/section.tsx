import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  /** Monospace label above the heading, e.g. "02 / experience". */
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", className)}>
      <Reveal>
        <div className="mb-10 flex flex-col gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
