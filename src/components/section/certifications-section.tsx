/* eslint-disable @next/next/no-img-element */
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

export default function CertificationsSection() {
  return (
    <Section id="certifications" eyebrow="08 / certifications" title="Certifications">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {DATA.certifications.map((cert, index) => (
          <Reveal key={cert.name} index={index}>
            <div className="flex h-full items-center gap-3 bg-background p-4">
              <img
                src={cert.logoUrl}
                alt=""
                className="size-11 flex-none rounded-md border border-border bg-card object-contain p-1.5"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-snug">{cert.name}</span>
                <span className="mono text-[11px] text-muted-foreground">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ""}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
