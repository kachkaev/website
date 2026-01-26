import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "standalone",
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },

  redirects: () => [
    {
      source: "/index.(htm|html|php)",
      destination: "/",
      permanent: false,
    },
    {
      source: "/:path*/index.(htm|html|php)",
      destination: "/:path*",
      permanent: false,
    },
  ],
};

export default nextConfig;
