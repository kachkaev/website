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
      "@eslint-react/web-api/no-leaked-event-listener": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/require-await": "off",
      "react-hooks/purity": "off",
    },
  },
]);
