import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

export default function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="05 / toolkit"
      title="What I work with"
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {DATA.skills.map((group, index) => (
          <Reveal key={group.category} index={index}>
            <div className="h-full bg-background p-5">
              <h3 className="eyebrow mb-4">{group.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="mono rounded-md border border-border bg-card/40 px-2.5 py-1 text-[12px] text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
