import { z } from "zod";

import {
  fetchJson,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

const maxReposPerPage = 100;

export const GET = generateUpdateProfileHandler({
  profileName: "github",
  generateProfileInfo: async () => {
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

    const languageSet = new Set(listOfRepos.map((repo) => repo.language));
    // eslint-disable-next-line unicorn/no-null
    languageSet.delete(null);

    return {
      repoCount: listOfRepos.length,
      sourceCount: sources.length,
      languageCount: languageSet.size,
    };
  },
});

export const dynamic = "force-dynamic";
