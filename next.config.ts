import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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

export default withNextIntl(nextConfig);
