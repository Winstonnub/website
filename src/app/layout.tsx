import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

const description = `${DATA.role} · ${DATA.secondaryRole}. ${DATA.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} — ${DATA.role}`,
    template: `%s | ${DATA.name}`,
  },
  description,
  openGraph: {
    title: DATA.name,
    description,
    url: DATA.url,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: DATA.name,
    description,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "relative min-h-screen bg-background font-sans antialiased",
          geist.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TooltipProvider delayDuration={0}>
            {/* Blueprint grid behind everything, faded out toward the bottom. */}
            <div
              aria-hidden
              className="lab-grid pointer-events-none fixed inset-0 z-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
