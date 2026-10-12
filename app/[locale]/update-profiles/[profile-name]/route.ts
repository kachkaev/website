import { type NextRequest, NextResponse } from "next/server";

import { isProfileName, updateProfileInfo } from "../../shared/profile-infos";
import { serverEnv } from "../../shared/server-env";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/[locale]/update-profiles/[profile-name]">,
): Promise<NextResponse> {
  const { "profile-name": profileName } = await params;

  if (!isProfileName(profileName)) {
    return NextResponse.json({ error: "Profile is unknown" }, { status: 404 });
  }

  if (!serverEnv.UPDATE_PROFILE_SECURITY_TOKEN) {
    return NextResponse.json(
      { error: "Security token is not set" },
      { status: 500 },
    );
  }

  const securityTokenIsValid =
    request.headers.get("x-security-token") ===
      serverEnv.UPDATE_PROFILE_SECURITY_TOKEN ||
    new URL(request.url).searchParams.has(
      serverEnv.UPDATE_PROFILE_SECURITY_TOKEN,
    );

  if (!securityTokenIsValid) {
    return NextResponse.json(
      { error: "Security token is invalid or missing" },
      { status: 403 },
    );
  }

  try {
    const profileInfo = await updateProfileInfo(profileName);

    return NextResponse.json({ profileInfo });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
}
