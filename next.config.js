// @ts-check

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // We call linters in GitHub Actions for all pull requests. By not linting
  // again during `next build`, we save CI minutes and unlock more feedback.
  // For local checks, run `pnpm run lint`.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
