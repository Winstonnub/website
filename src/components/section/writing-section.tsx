import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { allPosts } from "content-collections";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function WritingSection() {
  const posts = [...allPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Section
      id="writing"
      eyebrow="09 / writing"
      title="Notes"
      description="Occasional write-ups on what I'm learning."
    >
      <div className="flex flex-col">
        {posts.map((post, index) => {
          const slug = post._meta.path.replace(/\.mdx$/, "");
          return (
            <Reveal key={slug} index={index}>
              <Link
                href={`/blog/${slug}`}
                className="group grid gap-1.5 border-t border-border py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                    {post.title}
                    <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="max-w-2xl text-pretty text-[13px] leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                </div>
                <span className="mono flex-none text-[11px] text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Reveal index={3}>
        <Link
          href="/blog"
          className="mono mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
        >
          All posts
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Reveal>
    </Section>
  );
}
