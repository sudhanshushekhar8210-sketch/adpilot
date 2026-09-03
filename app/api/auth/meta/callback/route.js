import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      {
        error,
        message: errorDescription || "Meta authorization failed",
      },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "No authorization code received from Meta",
      },
      { status: 400 }
    );
  }

  try {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    const tokenUrl = new URL(
      "https://graph.facebook.com/oauth/access_token"
    );

    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const response = await fetch(tokenUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        {
          error: "Failed to exchange authorization code",
          details: data,
        },
        { status: 400 }
      );
    }

    const accessToken = data.access_token;

    // Temporary test:
    // Later we will securely store this token in MongoDB
    return NextResponse.json({
      success: true,
      message: "Meta account connected successfully!",
      accessToken: accessToken,
    });
  } catch (err) {
    console.error("Meta callback error:", err);

    return NextResponse.json(
      {
        error: "Something went wrong during Meta authentication",
      },
      { status: 500 }
    );
  }
}