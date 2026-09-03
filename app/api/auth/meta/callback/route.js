import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Meta se aane wale saare parameters temporarily check karenge
  const params = Object.fromEntries(searchParams.entries());

  console.log("META CALLBACK:", params);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorReason = searchParams.get("error_reason");

  // Agar Meta ne error bheja
  if (error) {
    return NextResponse.json(
      {
        success: false,
        metaError: error,
        reason: errorReason,
        description: errorDescription,
        allParams: params,
      },
      { status: 400 }
    );
  }

  // Agar code nahi mila
  if (!code) {
    return NextResponse.json(
      {
        success: false,
        error: "No authorization code received from Meta",
        allParams: params,
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
          success: false,
          error: "Failed to exchange authorization code",
          details: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Meta account connected successfully!",
      tokenReceived: !!data.access_token,
    });
  } catch (err) {
    console.error("Meta callback error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong during Meta authentication",
      },
      { status: 500 }
    );
  }
}