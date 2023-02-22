import { NextResponse } from "next/server";
import type { TypeOf, ZodType } from "zod";

import { writeProfileInfo } from "../../shared/profile-infos";

export async function fetchJson<Schema extends ZodType>(
  url: string,
  schema: Schema,
): Promise<TypeOf<Schema>> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return schema.parse(await res.json()) as unknown;
}

export function generateUpdateProfileHandler({
  profileName,
  generateProfileInfo,
}: {
  profileName: string;
  generateProfileInfo: () => Promise<Record<string, unknown>>;
}) {
  return async () => {
    try {
      const profileInfo = await generateProfileInfo();
      await writeProfileInfo(profileName, profileInfo);

      return NextResponse.json({ profileInfo });
    } catch (error: unknown) {
      return NextResponse.json({ error });
    }
  };
}
