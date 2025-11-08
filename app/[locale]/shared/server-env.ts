import "server-only";

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,

  server: {
    BASE_URL_EN: z.url().default("http://localhost:3000"),

    BASE_URL_RU: z.url().default("http://ru.localhost:3000"),

    DATA_DIR: z.string().default("./data"),

    GA_MEASUREMENT_ID: z.string().optional(),

    FLICKR_API_KEY: z.string().optional(),
    FLICKR_USER_ID: z.string().optional(),

    PLAYWRIGHT_HEADLESS: z.boolean().default(true),
    PLAYWRIGHT_USER_AGENT: z
      .string()
      .default(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:126.0) Gecko/20100101 Firefox/126.0",
      ),

    UPDATE_PROFILE_PROXY_SERVER_URL: z.url().optional(),
    UPDATE_PROFILE_SECURITY_TOKEN: z.string().optional(),
    // CARD_TYPE: createEnumSchema({
    //   values: ["classic", "satori"] as const,
    //   defaultValue: "classic",
    // }),

    // CLASSIC_PAGE_CACHE_SIZE: nonNegativeIntSchema.default(100),
    // CLASSIC_SERVER_SESSION_COOKIE_NAME: z.string().default("PHPSESSID"),
    // CLASSIC_SERVER_URL: z.string().default("https://classic.botnadzor.org"),

    // FRONTEND_AUTH_TOKEN: optionalStringSchema,
    // FRONTEND_URL: z.url().default("http://localhost:3000"),
    // FRONTEND_URL_FOR_SELF_REQUESTING: z.url().default("http://localhost:3000"),

    // JSON_BASED_POLL_PAGE: z.stringbool().default(false),

    // JSON_CACHE_SIZE: nonNegativeIntSchema.default(1000),

    // LOG_ARTIFICIAL_DELAYS: createEnumSchema({
    //   values: ["all", "start", "end", "none"] as const,
    //   defaultValue: "none",
    //   aliasesByValue: {
    //     all: ["true", "1"],
    //     none: ["false"],
    //   },
    // }),

    // LOG_CLASSIC_PAGE_CACHE: createEnumSchema({
    //   values: ["all", "errors", "hits", "misses", "none"] as const,
    //   defaultValue: "none",
    //   aliasesByValue: {
    //     all: ["true", "1"],
    //     none: ["false"],
    //   },
    // }),

    // LOG_CLASSIC_PAGE_ERRORS: createEnumSchema({
    //   values: ["all", "href", "html", "none"] as const,
    //   defaultValue: "none",
    //   aliasesByValue: {
    //     all: ["true", "1"],
    //     none: ["false"],
    //   },
    // }),

    // LOG_FETCH_FROM_UPSTREAM: z.stringbool().default(false),

    // LOG_JSON_CACHE: createEnumSchema({
    //   values: ["all", "errors", "hits", "misses", "none"] as const,
    //   defaultValue: "none",
    //   aliasesByValue: {
    //     all: ["true", "1"],
    //     none: ["false"],
    //   },
    // }),

    // PLAUSIBLE_URL: z.coerce.string().check(z.url()).optional(),

    // SIGNIFICANT_MENTION_COUNT: nonNegativeIntSchema.default(
    //   Number.MAX_SAFE_INTEGER,
    // ),

    // TIER_FORCED_VALUE: optionalStringSchema,
  },
});
