import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...generateNextConfigs({
    tailwindcssEntryPoint: "./app/[locale]/styles.css",
  }),

  {
    rules: {
      "@eslint-react/prefer-destructuring-assignment": "off", // Enable if `await props.params` is no longer used
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

  // TODO: Triage
  {
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  },
]);
