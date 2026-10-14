import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

type Entry = {
  title: string;
  description: string;
  /** Scholarships carry a level; awards carry a year. */
  level?: string;
  year?: string;
};

function EntryList({ items }: { items: readonly Entry[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.title}
          className="grid gap-1 border-t border-border py-3.5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-6"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{item.title}</span>
            <span className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
              {item.description}
            </span>
          </div>
          <span className="mono flex-none text-[11px] text-muted-foreground">
            {item.level ?? item.year}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function HonorsSection() {
  const totalAwards = DATA.honors.awards.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <Section
      id="honors"
      eyebrow="06 / honors"
      title="Scholarships & awards"
      description={`${DATA.honors.scholarships.length} scholarships and ${totalAwards} competition awards, from university back through secondary school.`}
    >
      <Reveal>
        <div className="mb-10">
          <h3 className="eyebrow mb-2">Scholarships</h3>
          <EntryList items={DATA.honors.scholarships} />
        </div>
      </Reveal>

      <Reveal index={1}>
        <div>
          <h3 className="eyebrow mb-2">Awards</h3>
          <Accordion type="multiple" className="flex flex-col">
            {DATA.honors.awards.map((group) => (
              <AccordionItem
                key={group.category}
                value={group.category}
                className="border-t border-border"
              >
                <AccordionTrigger className="gap-3 py-3.5 text-sm font-medium hover:no-underline">
                  <span className="flex flex-1 items-center justify-between gap-3 pr-3">
                    {group.category}
                    <span className="mono text-[11px] font-normal text-muted-foreground">
                      {group.items.length}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <EntryList items={group.items} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  );
}
