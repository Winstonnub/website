import { allPosts } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { paginate, normalizePage } from "@/lib/pagination";
import { Reveal } from "@/components/motion/reveal";

const description = "Notes on reinforcement learning, systems, and whatever I'm building.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  openGraph: { title: "Writing", description },
  twitter: { card: "summary_large_image", title: "Writing", description },
};

const PAGE_SIZE = 10;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    // Without a fixed zone the server (UTC) and the browser can land on
    // different days, which fails hydration with React error #418.
    timeZone: "UTC",
  });

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const sortedPosts = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const currentPage = normalizePage(pageParam, totalPages);
  const { items: paginatedPosts, pagination } = paginate(sortedPosts, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <main className="min-h-dvh py-16">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3">
          <span className="eyebrow">
            writing · {sortedPosts.length} post{sortedPosts.length === 1 ? "" : "s"}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </Reveal>

      {paginatedPosts.length > 0 ? (
        <>
          <div className="flex flex-col">
            {paginatedPosts.map((post, index) => {
              const slug = post._meta.path.replace(/\.mdx$/, "");
              return (
                <Reveal key={slug} index={index}>
                  <Link
                    href={`/blog/${slug}`}
                    className="group grid gap-1.5 border-t border-border py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8"
                  >
                    <div className="flex flex-col gap-1">
                      <h2 className="flex items-center gap-1.5 font-medium tracking-tight">
                        {post.title}
                        <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </h2>
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

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
              <span className="mono text-[11px] text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                {pagination.hasPreviousPage ? (
                  <Link
                    href={`/blog?page=${pagination.page - 1}`}
                    className="mono rounded-full border border-border px-3 py-1.5 text-[11px] transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="mono rounded-full border border-border px-3 py-1.5 text-[11px] opacity-40">
                    Previous
                  </span>
                )}
                {pagination.hasNextPage ? (
                  <Link
                    href={`/blog?page=${pagination.page + 1}`}
                    className="mono rounded-full border border-border px-3 py-1.5 text-[11px] transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="mono rounded-full border border-border px-3 py-1.5 text-[11px] opacity-40">
                    Next
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No posts yet. Check back soon.
          </p>
        </div>
      )}
    </main>
  );
}
