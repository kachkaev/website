import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  experimental: {
    // The root layout is inside the [locale] segment, so there is no app/layout.tsx that
    // app/not-found.tsx could be composed with. Without this flag, Next.js wraps not-found.tsx
    // into a built-in `<html><body>` layout, which conflicts with the document rendered by Shell.
    globalNotFound: true,

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

export default withNextIntl(nextConfig);
