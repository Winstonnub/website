"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { DATA } from "@/data/resume";
import { EmailButton } from "@/components/email-button";
import { MaskText } from "@/components/v2/mask-text";
import { Marquee } from "@/components/v2/marquee";
import Intro from "@/components/v2/intro";
import RocketCursor from "@/components/v2/rocket-cursor";
import Timeline from "@/components/v2/timeline";
import ProjectRail from "@/components/v2/project-rail";
import HeroScene from "@/components/three/hero-scene";
import CommandPalette from "@/components/command-palette";
import EasterEggs from "@/components/easter-eggs";
import XraySlider from "@/components/interactive/xray-slider";
import HonorsSection from "@/components/section/honors-section";
import LeadershipSection from "@/components/section/leadership-section";
import CertificationsSection from "@/components/section/certifications-section";
import WritingSection from "@/components/section/writing-section";

// WebGL stays out of the server bundle and off the critical path.
const CosmosScene = dynamic(
  () => import("@/components/v2/cosmos/cosmos-scene"),
  { ssr: false },
);

const MapfRace = dynamic(() => import("@/components/interactive/mapf-race"));
const BlackjackTable = dynamic(
  () => import("@/components/interactive/blackjack-table"),
);

function SectionHeading({
  index,
  lines,
  note,
}: {
  index: string;
  lines: readonly string[];
  note?: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4">
      <span className="mono text-[11px] uppercase tracking-[0.3em] text-white/60">
        {index}
      </span>
      <MaskText
        lines={lines}
        className="display text-5xl text-white sm:text-6xl lg:text-7xl"
      />
      {note && (
        <p className="max-w-xl text-sm leading-relaxed text-white/70">{note}</p>
      )}
    </div>
  );
}

/** Existing sections were built for the column layout; frost them for depth. */
function Frosted({ children }: { children: React.ReactNode }) {
  return (
    <div className="void-panel rounded-3xl px-6 sm:px-10">{children}</div>
  );
}

export default function V2Experience() {
  const warpRef = useRef(0);
  const [entered, setEntered] = useState(false);

  const handleComplete = useCallback(() => setEntered(true), []);

  // Konami code fires an actual hyperspace burst through the same uniform the
  // intro uses: ramp warp up, hold, ease back down.
  const burst = useCallback(() => {
    const start = performance.now();
    const UP = 420;
    const HOLD = 260;
    const DOWN = 1100;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < UP) {
        warpRef.current = elapsed / UP;
      } else if (elapsed < UP + HOLD) {
        warpRef.current = 1;
      } else if (elapsed < UP + HOLD + DOWN) {
        const t = (elapsed - UP - HOLD) / DOWN;
        warpRef.current = 1 - (1 - Math.pow(1 - t, 3));
      } else {
        warpRef.current = 0;
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return true;
  }, []);

  // Fail open. If the intro never finishes — a background tab suspends
  // requestAnimationFrame, or the sequence errors — the hero still reveals.
  // Timers keep firing when rAF does not.
  useEffect(() => {
    const safety = window.setTimeout(() => setEntered(true), 4500);
    return () => window.clearTimeout(safety);
  }, []);

  const allSkills = DATA.skills.flatMap((group) => group.items);
  const half = Math.ceil(allSkills.length / 2);

  return (
    <>
      <CosmosScene warpRef={warpRef} />
      <Intro warpRef={warpRef} onComplete={handleComplete} />
      <CommandPalette />
      <EasterEggs onKonami={burst} />
      <RocketCursor />

      <div className="relative z-10">
        {/* Minimal chrome — the scene is the page. */}
        <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="mono text-[12px] text-white/75 transition-colors hover:text-white"
          >
            winston.liang
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/classic"
              className="mono text-[11px] text-white/60 transition-colors hover:text-white"
            >
              reading view
            </Link>
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
                    className="text-white/70 transition-colors hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="flex min-h-dvh flex-col justify-center px-6 pb-12 pt-24 sm:px-10 [@media(max-height:760px)]:pb-8 [@media(max-height:760px)]:pt-20">
          <div className="mx-auto w-full max-w-6xl">
            <span className="mono mb-6 block text-[11px] uppercase tracking-[0.3em] text-primary/80">
              {DATA.location}
            </span>

            <h1 className="display text-[clamp(2.25rem,8.5vw,4.75rem)] text-white">
              <MaskText
                lines={["I train models.", "I ship software.", "I fill rooms."]}
                delay={0.1}
                active={entered}
              />
            </h1>

            <div className="mt-8 grid gap-7 lg:grid-cols-[1.1fr_1fr] [@media(max-height:760px)]:mt-5">
              <p className="max-w-xl text-lg leading-snug text-white/70">
                Reinforcement learning research at NUS. Data models at Shopify.
                A 400-person AI conference at UofT.
              </p>

              <div className="flex flex-col gap-6">
                {/* Height is capped against the viewport so the landing
                    still fits and the CTAs stay above the fold. */}
                <a
                  href="https://utmist.ca/eigenai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[16/9] max-h-[22vh] w-full overflow-hidden rounded-2xl border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/eigenai.jpg"
                    alt="Speaking on stage at EigenAI, UTMIST's flagship AI conference"
                    className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#05060c] via-[#05060c]/25 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <span className="flex flex-col">
                      <span className="mono text-[10px] uppercase tracking-[0.2em] text-primary">
                        EigenAI
                      </span>
                      <span className="text-sm font-medium text-white">
                        The conference I ran
                      </span>
                      <span className="mono text-[11px] text-white/60">
                        400+ tickets · sponsors incl. Stripe
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 flex-none text-white/50 transition-colors group-hover:text-primary" />
                  </span>
                </a>

                <p className="mono text-[13px] leading-relaxed text-white/65">
                  Third year at UofT, Computer Science and Data Science.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#work"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#05060c] transition-transform hover:-translate-y-0.5"
                  >
                    Enter
                    <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </a>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Work + education ─────────────────────────────────── */}
        <section id="work" className="px-6 py-28 sm:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <SectionHeading
              index="01 — the path"
              lines={["Where", "I've been."]}
            />
            <Timeline />
          </div>
        </section>

        {/* ── Projects ─────────────────────────────────────────── */}
        <section id="projects" className="py-28">
          <div className="mx-auto mb-4 w-full max-w-5xl px-6 sm:px-10">
            <SectionHeading
              index="02 — the work"
              lines={["Things", "I built."]}
            />
          </div>
          <ProjectRail />
        </section>

        {/* ── Interactive research demo ────────────────────────── */}
        <section id="research" className="px-6 py-28 sm:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <SectionHeading
              index="03 — try it"
              lines={["Poke at", "the work."]}
              note="Three of these projects, running here instead of described."
            />

            <div className="flex flex-col gap-14">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white">
                  Agents routing around you
                </h3>
                <HeroScene />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white">
                  Why multi-agent path-finding is hard
                </h3>
                <MapfRace />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white">
                  Play the blackjack agent
                </h3>
                <BlackjackTable />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white">
                  Scoliosis detection
                </h3>
                <XraySlider />
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills ───────────────────────────────────────────── */}
        <section id="skills" className="overflow-hidden py-28">
          <div className="mx-auto mb-10 w-full max-w-5xl px-6 sm:px-10">
            <SectionHeading index="04 — tools" lines={["What", "I use."]} />
          </div>
          <div className="flex flex-col gap-3">
            <Marquee items={allSkills.slice(0, half)} duration={48} />
            <Marquee items={allSkills.slice(half)} duration={54} reverse />
          </div>
        </section>

        {/* ── Remaining detail, in frosted panels ──────────────── */}
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-28 sm:px-10">
          <Frosted>
            <HonorsSection />
          </Frosted>
          <Frosted>
            <LeadershipSection />
          </Frosted>
          <Frosted>
            <CertificationsSection />
          </Frosted>
          <Frosted>
            <WritingSection />
          </Frosted>
        </div>

        {/* ── Contact ──────────────────────────────────────────── */}
        <section id="contact" className="px-6 pb-32 sm:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <SectionHeading index="05 — end" lines={["Say", "hello."]} />
            <p className="mb-8 max-w-xl text-lg leading-snug text-white/70">
              Happy to talk about research, systems work, or a role you&apos;re
              hiring for.
            </p>
            <EmailButton withCopy />
          </div>
        </section>

        <footer className="border-t border-white/10 px-6 py-8 sm:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col justify-between gap-2 sm:flex-row">
            <span className="mono text-[11px] text-white/55">
              © {new Date().getFullYear()} {DATA.name}
            </span>

          </div>
        </footer>
      </div>
    </>
  );
}
