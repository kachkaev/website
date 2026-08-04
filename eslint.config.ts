import eslintPluginCss from "@eslint/css";
import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { tailwind4 } from "tailwind-csstree";

const tailwindcssEntryPoint = "./app/[locale]/styles.css";

export default defineConfig([
  // Configs for TS and TSX are not restricted to these extensions, so they break on CSS
  ...generateNextConfigs({ tailwindcssEntryPoint }).map((config) =>
    (config.rules ?? config.languageOptions)
      ? { ...config, ignores: [...(config.ignores ?? []), "**/*.css"] }
      : config,
  ),

  // Class names in @apply are invisible to the configs above, which only cover TS and TSX
  {
    name: "tailwindcss in css",
    files: ["**/*.css"],
    language: "css/css",
    languageOptions: { customSyntax: tailwind4, tolerant: true },
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
      css: eslintPluginCss,
    },
    settings: { "better-tailwindcss": { entryPoint: tailwindcssEntryPoint } },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": "warn",
      "better-tailwindcss/enforce-consistent-class-order": "warn",
      "better-tailwindcss/enforce-consistent-variable-syntax": "warn",
      "better-tailwindcss/enforce-shorthand-classes": "warn",
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-deprecated-classes": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",
      "better-tailwindcss/no-restricted-classes": "error",
      "better-tailwindcss/no-unknown-classes": "error",
      "better-tailwindcss/no-unnecessary-whitespace": "warn",
    },
  },

  {
    // The shared config allowlists Next.js file conventions, but not this one yet
    files: ["app/global-not-found.tsx"],
    rules: {
      "import/no-default-export": "off",
    },
  },

  {
    ignores: ["**/*.css"],
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
