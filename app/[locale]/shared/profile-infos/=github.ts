import { z } from "zod";

import { fetchJson } from "./shared/fetch-json";
import type { ProfileDefinition } from "./shared/types";

const infoSchema = z.object({
  repoCount: z.number(),
  sourceCount: z.number(),
  languageCount: z.number(),
});

const maxReposPerPage = 100;

export const githubProfileDefinition = {
  infoSchema,
  generateInfo: async () => {
    const schema = z.array(
      z.object({
        language: z.nullable(z.string()),
        fork: z.boolean(),
      }),
    );

    const listOfRepos: z.infer<typeof schema> = [];
    let page = 1;
    for (;;) {
      const currentListOfRepos = await fetchJson(
        `https://api.github.com/users/kachkaev/repos?page=${page}&per_page=${maxReposPerPage}`,
        schema,
      );

      listOfRepos.push(...currentListOfRepos);
      if (currentListOfRepos.length !== maxReposPerPage) {
        break;
      }
      page += 1;
    }

    const sources = listOfRepos.filter((repo) => !repo.fork);

    const languageSet = new Set(
      listOfRepos
        .map((repo) => repo.language)
        .filter((language) => language !== null),
    );

    return {
      repoCount: listOfRepos.length,
      sourceCount: sources.length,
      languageCount: languageSet.size,
    };
  },
} satisfies ProfileDefinition<typeof infoSchema>;
