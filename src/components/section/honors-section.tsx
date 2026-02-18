"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";

export default function HonorsSection() {
    const { scholarships, awards } = DATA.honors;

    // Helper to group items by year/category
    const groupItemsByYear = (items: ReadonlyArray<{ year: string; title: string; description?: string }>) => {
        return items.reduce((acc, item) => {
            if (!acc[item.year]) {
                acc[item.year] = [];
            }
            acc[item.year].push(item);
            return acc;
        }, {} as Record<string, { year: string; title: string; description?: string }[]>);
    };

    const scholarshipsByYear = groupItemsByYear(scholarships);
    const awardsByYear = groupItemsByYear(awards);

    // Custom sort order for Scholarships: University -> High School -> Others
    const scholarshipSort = (a: string, b: string) => {
        const order = ["University", "High School"];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        // If both are in the known order list
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is known, it comes first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // Otherwise sort typically
        return b.localeCompare(a);
    };

    return (
        <div className="flex flex-col gap-y-12">
            {/* Scholarships Section */}
            <div className="flex flex-col gap-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Scholarships</h2>
                <Accordion type="single" collapsible className="flex flex-col gap-3">
                    {Object.entries(scholarshipsByYear)
                        .sort(([yearA], [yearB]) => scholarshipSort(yearA, yearB))
                        .map(([year, items]) => (
                            <AccordionItem key={year} value={`scholarship-${year}`} className="border rounded-lg bg-card px-4 py-1 shadow-sm">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-base font-semibold tracking-tight">{year}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 grid gap-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-1 pb-4 last:pb-0 border-b last:border-0 border-dashed">
                                            <h4 className="font-semibold text-base leading-tight">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </div>

            {/* Awards Section */}
            <div className="flex flex-col gap-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Awards & Competitions</h2>
                <Accordion type="single" collapsible className="flex flex-col gap-3">
                    {Object.entries(awardsByYear)
                        .map(([year, items]) => (
                            <AccordionItem key={year} value={`award-${year}`} className="border rounded-lg bg-card px-4 py-1 shadow-sm">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <span className="text-base font-semibold tracking-tight">{year}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 grid gap-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex flex-col gap-1 pb-4 last:pb-0 border-b last:border-0 border-dashed">
                                            <h4 className="font-semibold text-base leading-tight">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </div>
        </div>
    );
}
