import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...generateNextConfigs({
    tailwindcssEntryPoint: "./app/[locale]/styles.css",
  }),

  {
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
