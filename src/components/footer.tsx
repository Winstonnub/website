import { DATA } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {DATA.name} · {DATA.location}
        </p>
        <p className="mono text-[11px] text-muted-foreground">
          Built with Next.js and three.js
        </p>
      </div>
    </footer>
  );
}
