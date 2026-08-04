import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // `typescript` resolves to `@typescript/typescript6`, which ships no `tsc`
    // binary, so Next.js has to use the TypeScript API instead of the CLI
    useTypeScriptCli: false,
  },

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
