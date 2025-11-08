import * as envalid from "envalid";

export * as envalid from "envalid";

export function cleanProcessEnv<T>(specs: {
  [K in keyof T]: envalid.ValidatorSpec<T[K]>;
}): envalid.CleanedEnv<{ [K in keyof T]: envalid.ValidatorSpec<T[K]> }> {
  return envalid.cleanEnv(process.env, specs, {
    reporter: ({ errors }) => {
      if (Object.keys(errors).length === 0) {
        return;
      }

      const messageChunks: string[] = [];
      envalid.envalidErrorFormatter(errors, (message) => {
        if (typeof message !== "string") {
          return;
        }
        messageChunks.push(message);
      });

      throw new Error(messageChunks.join("\n") || "Invalid environment");
    },
  });
}
