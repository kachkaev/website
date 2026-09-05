import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  generateNextConfigs({ tailwindcssEntryPoint: "./app/[locale]/styles.css" }),

  {
    // Rules added in eslint-plugin-unicorn v65–v74 (via @kachkaev/eslint-config-next v2) that this
    // codebase does not adopt yet; reviewed collectively in https://github.com/kachkaev/repo-dive/issues/212.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "unicorn/consistent-boolean-name": "off", // Flags exported names that follow external conventions, such as `instant` in global-not-found.tsx.
      "unicorn/max-nested-calls": "off",
      "unicorn/single-line-block-comment-style": "off", // Single-line `/** … */` doc comments are the norm here; rewriting them into three-line blocks is churn without benefit. // Data-shaping pipelines in route handlers nest calls deeply by nature.
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "import/no-extraneous-dependencies": [
        "warn",
        {
          devDependencies: true, // Allowing imports from dev dependencies because build is standalone
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
]);
