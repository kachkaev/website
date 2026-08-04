import type { KnipConfig } from "knip";

export default {
  ignoreDependencies: [
    "@next/eslint-plugin-next", // Pins dependency version inside @kachkaev/eslint-config-next
  ],
} satisfies KnipConfig;
