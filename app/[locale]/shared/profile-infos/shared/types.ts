import type { z } from "zod";

export type ProfileDefinition<InfoSchema extends z.ZodType = z.ZodType> = {
  infoSchema: InfoSchema;
  generateInfo: (payload: {
    errorPathPrefix: string;
  }) => Promise<z.output<InfoSchema>>;
};
