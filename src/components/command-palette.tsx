"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Command, CornerDownLeft } from "lucide-react";
import { DATA } from "@/data/resume";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: "Go" | "Projects" | "Actions";
  run: () => void;
};

const EMAIL_LOCAL = "cywinston.liang";
const EMAIL_DOMAIN = "mail.utoronto.ca";

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      close();
      if (href.startsWith("http")) window.open(href, "_blank", "noopener");
      else router.push(href);
    };

    const sections: Item[] = [
      { id: "home", label: "Home", hint: "/", group: "Go", run: go("/") },
      { id: "work", label: "Experience & education", hint: "/#work", group: "Go", run: go("/#work") },
      { id: "projects", label: "Projects", hint: "/#projects", group: "Go", run: go("/#projects") },
      { id: "playground", label: "Playground", hint: "/#research", group: "Go", run: go("/#research") },
      { id: "honors", label: "Scholarships & awards", hint: "/#honors", group: "Go", run: go("/#honors") },
      { id: "leadership", label: "Leadership", hint: "/#leadership", group: "Go", run: go("/#leadership") },
      { id: "writing", label: "Writing", hint: "/blog", group: "Go", run: go("/blog") },
      { id: "classic", label: "Reading view", hint: "/classic", group: "Go", run: go("/classic") },
    ];

    const projects: Item[] = DATA.projects.map((project) => ({
      id: `project-${project.title}`,
      label: project.title,
      hint: project.technologies.slice(0, 3).join(" · "),
      group: "Projects" as const,
      run: project.href ? go(project.href) : go("/#projects"),
    }));

    const actions: Item[] = [
      {
        id: "copy-email",
        label: "Copy email address",
        hint: "to clipboard",
        group: "Actions",
        run: () => {
          navigator.clipboard
            .writeText(`${EMAIL_LOCAL}@${EMAIL_DOMAIN}`)
            .then(() => flash("Email copied"))
            .catch(() => flash("Clipboard blocked"));
          close();
        },
      },
      {
        id: "email",
        label: "Send an email",
        hint: "opens your mail client",
        group: "Actions",
        run: () => {
          window.location.href = `mailto:${EMAIL_LOCAL}@${EMAIL_DOMAIN}`;
          close();
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "Winstonnub",
        group: "Actions",
        run: go(DATA.contact.social.GitHub.url),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "winston-liang",
        group: "Actions",
        run: go(DATA.contact.social.LinkedIn.url),
      },
    ];

    return [...sections, ...projects, ...actions];
  }, [close, flash, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActive(0);
        setOpen((o) => !o);
        return;
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    // Focus after the enter animation starts, or the caret jumps.
    // `active` is reset by close() and by every change to the query.
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((a) => (a + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[active]?.run();
    }
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to a section, project, or action…"
                className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />

              <ul className="max-h-[52vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nothing matches that.
                  </li>
                )}
                {filtered.map((item, index) => {
                  const showGroup = item.group !== lastGroup;
                  lastGroup = item.group;
                  return (
                    <li key={item.id}>
                      {showGroup && (
                        <div className="eyebrow px-3 pb-1 pt-3">{item.group}</div>
                      )}
                      <button
                        type="button"
                        onMouseEnter={() => setActive(index)}
                        onClick={item.run}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          index === active
                            ? "bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="mono flex items-center gap-2 text-[11px] text-muted-foreground">
                          {item.hint}
                          {index === active && <CornerDownLeft className="size-3" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discoverability: a small hint that opens the same palette. */}
      <button
        type="button"
        onClick={() => {
          setActive(0);
          setOpen(true);
        }}
        aria-label="Open command palette"
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-2 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground sm:inline-flex"
      >
        <Command className="size-3.5" />
        <span className="mono">K</span>
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mono fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-primary/40 bg-background/90 px-4 py-2 text-[12px] text-primary backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
