import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `next build` and `next dev` both write to .next by default, so running a
  // build while the dev server is serving corrupts the chunks it hands out.
  // Verification builds set BUILD_DIR to keep out of the dev server's way.
  distDir: process.env.BUILD_DIR || ".next",
  async redirects() {
    return [
      // The cinematic version moved to the root; keep old links working.
      { source: "/v2", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
