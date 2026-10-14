import type { Metadata } from "next";
import HeroSection from "@/components/section/hero-section";
import WorkSection from "@/components/section/work-section";
import EducationSection from "@/components/section/education-section";
import ProjectsSection from "@/components/section/projects-section";
import PlaygroundSection from "@/components/section/playground-section";
import SkillsSection from "@/components/section/skills-section";
import HonorsSection from "@/components/section/honors-section";
import LeadershipSection from "@/components/section/leadership-section";
import CertificationsSection from "@/components/section/certifications-section";
import WritingSection from "@/components/section/writing-section";
import ContactSection from "@/components/section/contact-section";

export const metadata: Metadata = {
  title: "Reading view",
  description:
    "The same work, laid out as a single readable column instead of a scene.",
};

export default function ClassicPage() {
  return (
    <main className="flex min-h-dvh flex-col divide-y divide-border">
      <HeroSection />
      <WorkSection />
      <EducationSection />
      <ProjectsSection />
      <PlaygroundSection />
      <SkillsSection />
      <HonorsSection />
      <LeadershipSection />
      <CertificationsSection />
      <WritingSection />
      <ContactSection />
    </main>
  );
}
