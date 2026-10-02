import type { NextConfig } from "next";

// The API is reached through this app's own origin rather than called cross-site.
// The session cookies are SameSite=Strict and the route guard in proxy.ts reads
// them on this origin, so a browser talking to the API directly on another site
// would drop them and loop back to the login page.
const apiOrigin = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

if (!apiOrigin) {
  throw new Error("API_PROXY_TARGET is not set. Point it at the API origin, e.g. http://localhost:5001.");
}

const nextConfig: NextConfig = {
  experimental: {
    // Render's free tier takes up to ~50s to wake, past the 30s default.
    proxyTimeout: 90_000,
  },
  async redirects() {
    return [
      { source: "/", destination: "/dashboard/overview", permanent: false },
      { source: "/dashboard", destination: "/dashboard/overview", permanent: false },
    ]
  },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` }]
  },
};

export default nextConfig;
