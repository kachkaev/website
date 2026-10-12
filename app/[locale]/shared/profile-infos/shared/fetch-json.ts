import type { ZodType } from "zod";

export async function fetchJson<Schema extends ZodType>(
  url: string,
  schema: Schema,
): Promise<Schema["_output"]> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: unknown = await response.json();

  return schema.parse(data);
}
