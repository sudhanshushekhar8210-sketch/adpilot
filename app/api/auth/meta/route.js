import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.META_APP_ID;
  const configId = process.env.META_CONFIG_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !configId || !redirectUri) {
    return NextResponse.json(
      {
        success: false,
        error: "Meta environment variables are missing",
      },
      { status: 500 }
    );
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    config_id: configId,
    response_type: "code",
    override_default_response_type: "true",
    state,
  });

  const metaLoginUrl =
    `https://www.facebook.com/dialog/oauth?${params.toString()}`;

  return NextResponse.redirect(metaLoginUrl);
}