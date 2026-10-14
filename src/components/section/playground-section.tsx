import dynamic from "next/dynamic";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import XraySlider from "@/components/interactive/xray-slider";

// These carry policy data and canvas work; keep them off the first paint.
const MapfRace = dynamic(() => import("@/components/interactive/mapf-race"));
const BlackjackTable = dynamic(
  () => import("@/components/interactive/blackjack-table"),
);

function Block({
  title,
  description,
  children,
  index,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <Reveal index={index}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

export default function PlaygroundSection() {
  return (
    <Section
      id="playground"
      eyebrow="04 / playground"
      title="Things you can poke at"
      description="Three of the projects above, running here instead of described."
    >
      <div className="flex flex-col gap-14">
        <Block
          index={0}
          title="Why multi-agent path-finding is hard"
          description="Six agents, one map, two planners running side by side. Draw walls and watch what happens when agents plan without looking at each other."
        >
          <MapfRace />
        </Block>

        <Block
          index={1}
          title="Play the blackjack agent"
          description="The policies are the real Q-tables exported from the project, each trained over a million episodes. Ask the agent what it would do and it will show you its Q-values."
        >
          <BlackjackTable />
        </Block>

        <Block
          index={2}
          title="Scoliosis detection"
          description="Drag across the X-ray to reveal what the model found."
        >
          <XraySlider />
        </Block>
      </div>
    </Section>
  );
}
