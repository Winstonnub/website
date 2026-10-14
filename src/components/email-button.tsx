"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Held in pieces and joined at click time, so the address never appears as
// text or as a mailto href in the rendered HTML for scrapers to lift.
const LOCAL = "cywinston.liang";
const DOMAIN = "mail.utoronto.ca";

const address = () => `${LOCAL}@${DOMAIN}`;

type EmailButtonProps = {
  label?: string;
  className?: string;
  /** Shows a second button that copies the address instead of opening a client. */
  withCopy?: boolean;
};

export function EmailButton({
  label = "Email me",
  className,
  withCopy = false,
}: EmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const open = () => {
    window.location.href = `mailto:${address()}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; fall back to the mail client.
      open();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={open}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5",
          className,
        )}
      >
        <Mail className="size-4" />
        {label}
      </button>

      {withCopy && (
        <button
          type="button"
          onClick={copy}
          aria-label="Copy email address"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy address"}
        </button>
      )}
    </div>
  );
}
