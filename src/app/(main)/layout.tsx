import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CommandPalette from "@/components/command-palette";
import EasterEggs from "@/components/easter-eggs";

/**
 * The reading-width shell: navbar, centred column, footer.
 * Routes outside this group (like /v2) render full-bleed instead.
 */
export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-6">
      <Navbar />
      {children}
      <Footer />
      <CommandPalette />
      <EasterEggs />
    </div>
  );
}
