import { NextResponse } from "next/server";

import { writeProfileInfo } from "../../shared/profile-infos";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.openstreetmap.org/api/0.6/user/231451.json",
      {
        headers: {
          // @todo re-enable eslint-disable-next-line @typescript-eslint/naming-convention -- third-party API
          "Content-Type": "application/json",
        },
      },
    );
    const { user } = await res.json();

    const changesetCount = user?.changesets?.count;
    const gpsTraceCount = user?.traces?.count;

    if (!changesetCount || !gpsTraceCount) {
      throw new Error("Unexpected empty changeset count");
    }
    const profileInfo = {
      changesetCount,
      gpsTraceCount,
    };
    await writeProfileInfo("osm", profileInfo);

    return NextResponse.json({ profileInfo });
  } catch (error: unknown) {
    return NextResponse.json({ error });
  }
}
