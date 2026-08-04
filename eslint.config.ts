import { generateNextConfigs } from "@kachkaev/eslint-config-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...generateNextConfigs({
    tailwindcssEntryPoint: "./app/[locale]/styles.css",
  }),

  {
    // The shared config allowlists Next.js file conventions, but not this one yet
    files: ["app/global-not-found.tsx"],
    rules: {
      "import/no-default-export": "off",
    },
  },

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
