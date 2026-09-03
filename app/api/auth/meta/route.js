import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MetaConnection from "@/models/MetaConnection";
import { encryptToken } from "@/lib/encryption";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  const error = searchParams.get("error");
  const errorDescription =
    searchParams.get("error_description");

  // Meta authorization error
  if (error) {
    return NextResponse.json(
      {
        success: false,
        error,
        message:
          errorDescription ||
          "Meta authorization failed",
      },
      { status: 400 }
    );
  }

  // Authorization code missing
  if (!code) {
    return NextResponse.json(
      {
        success: false,
        error: "No authorization code received from Meta",
      },
      { status: 400 }
    );
  }

  try {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      return NextResponse.json(
        {
          success: false,
          error: "Meta environment variables are missing",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------
    // STEP 1: Exchange authorization code for token
    // ------------------------------------------------

    const tokenUrl = new URL(
      "https://graph.facebook.com/oauth/access_token"
    );

    tokenUrl.searchParams.set(
      "client_id",
      appId
    );

    tokenUrl.searchParams.set(
      "client_secret",
      appSecret
    );

    tokenUrl.searchParams.set(
      "redirect_uri",
      redirectUri
    );

    tokenUrl.searchParams.set(
      "code",
      code
    );

    const tokenResponse = await fetch(
      tokenUrl.toString(),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const tokenData =
      await tokenResponse.json();

    if (
      !tokenResponse.ok ||
      tokenData.error
    ) {
      console.error(
        "Meta token exchange error:",
        tokenData
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to exchange authorization code",
          details: tokenData,
        },
        { status: 400 }
      );
    }

    const accessToken =
      tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Meta did not return an access token",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------
    // STEP 2: Get Meta user information
    // ------------------------------------------------

    const meUrl = new URL(
      "https://graph.facebook.com/me"
    );

    meUrl.searchParams.set(
      "fields",
      "id,name"
    );

    meUrl.searchParams.set(
      "access_token",
      accessToken
    );

    const meResponse = await fetch(
      meUrl.toString(),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const meData =
      await meResponse.json();

    if (
      !meResponse.ok ||
      meData.error ||
      !meData.id
    ) {
      console.error(
        "Meta user fetch error:",
        meData
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to get Meta user information",
          details: meData,
        },
        { status: 400 }
      );
    }

    const metaUserId = meData.id;

    // ------------------------------------------------
    // STEP 3: Encrypt access token
    // ------------------------------------------------

    const encryptedToken =
      encryptToken(accessToken);

    // ------------------------------------------------
    // STEP 4: Connect MongoDB
    // ------------------------------------------------

    await connectDB();

    // ------------------------------------------------
    // STEP 5: Save / update Meta connection
    // ------------------------------------------------

    await MetaConnection.findOneAndUpdate(
      {
        metaUserId,
      },
      {
        metaUserId,

        accessToken: encryptedToken,

        tokenExpiresAt:
          tokenData.expires_in
            ? new Date(
                Date.now() +
                  tokenData.expires_in *
                    1000
              )
            : null,

        connected: true,

        connectedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // ------------------------------------------------
    // STEP 6: Redirect user back to dashboard
    // ------------------------------------------------

    const dashboardUrl =
      new URL(
        "/dashboard",
        request.url
      );

    dashboardUrl.searchParams.set(
      "meta",
      "connected"
    );

    return NextResponse.redirect(
      dashboardUrl
    );
  } catch (error) {
    console.error(
      "Meta callback error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while connecting Meta",
      },
      { status: 500 }
    );
  }
}