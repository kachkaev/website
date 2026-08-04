import { defineConfig } from "cspell";

export default defineConfig({
  dictionaries: ["cspell-words.txt"],
  dictionaryDefinitions: [
    {
      name: "cspell-words.txt",
      path: "./cspell-words.txt",
      addWords: true,
    },
  ],
  ignorePaths: [
    ".git/**",
    ".husky/_/**",
    "node_modules/**",
    "package-lock.json",
    "pnpm-lock.yaml",
  ],
  import: ["@cspell/dict-ru_ru/cspell-ext.json"],
  language: "en,en-GB,ru",
  minWordLength: 3,
  useGitignore: true,
});
