import { Reveal } from "@/components/motion/reveal";
import { EmailButton } from "@/components/email-button";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <Reveal>
        <div className="glow-ring relative overflow-hidden rounded-2xl border border-border bg-card/40 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-5">
            <span className="eyebrow">10 / contact</span>
            <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Say hello
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Happy to talk about research, systems work, or a role you&apos;re
              hiring for. Email reaches me fastest, and I read everything.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <EmailButton withCopy />
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
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
