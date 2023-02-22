import * as envalid from "envalid";

export * as envalid from "envalid";

export const cleanProcessEnv = <T>(specs: {
  [K in keyof T]: envalid.ValidatorSpec<T[K]>;
}) => {
  return envalid.cleanEnv(process.env, specs, {
    reporter: ({ errors }) => {
      if (Object.keys(errors).length === 0) {
        return;
      }

      const messageChunks: string[] = [];
      envalid.envalidErrorFormatter(errors, (message) => {
        messageChunks.push(message as string);
      });

      throw new Error(messageChunks.join("\n"));
    },
  });
};
