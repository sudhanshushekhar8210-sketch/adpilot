import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MetaConnection from "@/models/MetaConnection";
import { decryptToken } from "@/lib/encryption";

export async function GET() {
  try {
    // ---------------------------------------------
    // STEP 1: MongoDB
    // ---------------------------------------------

    await connectDB();

    // ---------------------------------------------
    // STEP 2: Find Meta connection
    // ---------------------------------------------

    const metaConnection =
      await MetaConnection.findOne({
        connected: true,
      }).sort({ connectedAt: -1 });

    if (!metaConnection) {
      return NextResponse.json(
        {
          success: false,
          error: "No connected Meta account found",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------
    // STEP 3: Decrypt token
    // ---------------------------------------------

    let accessToken;

    try {
      accessToken = decryptToken(
        metaConnection.accessToken
      );
    } catch (error) {
      console.error(
        "Token decryption error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to decrypt Meta access token",
        },
        { status: 500 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Decrypted Meta access token is empty",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // STEP 4: Test Meta /me
    // ---------------------------------------------

    const meUrl = new URL(
      "https://graph.facebook.com/v23.0/me"
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

    const meData = await meResponse.json();

    // ---------------------------------------------
    // STEP 5: Fetch Facebook Pages
    // ---------------------------------------------

    const pagesUrl = new URL(
      "https://graph.facebook.com/v23.0/me/accounts"
    );

    pagesUrl.searchParams.set(
      "fields",
      "id,name,access_token,category"
    );

    pagesUrl.searchParams.set(
      "access_token",
      accessToken
    );

    const pagesResponse = await fetch(
      pagesUrl.toString(),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const pagesData = await pagesResponse.json();

    // ---------------------------------------------
    // STEP 6: Fetch Instagram accounts
    // ---------------------------------------------

    const instagramAccounts = [];

    const facebookPages =
      Array.isArray(pagesData.data)
        ? pagesData.data
        : [];

    for (const page of facebookPages) {
      const instagramUrl = new URL(
        `https://graph.facebook.com/v23.0/${page.id}/instagram_business_account`
      );

      instagramUrl.searchParams.set(
        "access_token",
        accessToken
      );

      const instagramResponse = await fetch(
        instagramUrl.toString(),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const instagramData =
        await instagramResponse.json();

      if (
        instagramResponse.ok &&
        instagramData.id
      ) {
        const instagramId =
          instagramData.id;

        const profileUrl = new URL(
          `https://graph.facebook.com/v23.0/${instagramId}`
        );

        profileUrl.searchParams.set(
          "fields",
          "id,username,name,profile_picture_url"
        );

        profileUrl.searchParams.set(
          "access_token",
          accessToken
        );

        const profileResponse =
          await fetch(
            profileUrl.toString(),
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const profileData =
          await profileResponse.json();

        instagramAccounts.push({
          id: instagramId,
          username:
            profileData.username || "",
          name:
            profileData.name || "",
          profile_picture_url:
            profileData.profile_picture_url ||
            "",
          facebookPageId: page.id,
        });
      }
    }

    // ---------------------------------------------
    // STEP 7: Save to MongoDB
    // ---------------------------------------------

    const updatedConnection =
      await MetaConnection.findOneAndUpdate(
        {
          _id: metaConnection._id,
        },
        {
          $set: {
            facebookPages,
            instagramAccounts,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedConnection) {
      return NextResponse.json(
        {
          success: false,
          error:
            "MongoDB update failed",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // STEP 8: Return SAFE diagnostic result
    // ---------------------------------------------

    return NextResponse.json({
      success: true,

      token: {
        decrypted: true,
        length: accessToken.length,
      },

      metaUser: {
        requestSuccessful: meResponse.ok,
        id: meData.id || null,
        name: meData.name || null,
        error: meData.error || null,
      },

      facebookPages: {
        requestSuccessful: pagesResponse.ok,
        count: facebookPages.length,
        data: facebookPages.map((page) => ({
          id: page.id,
          name: page.name,
          category: page.category || "",
          hasPageAccessToken:
            Boolean(page.access_token),
        })),
        error: pagesData.error || null,
      },

      instagramAccounts: {
        count: instagramAccounts.length,
        data: instagramAccounts,
      },

      mongoDB: {
        saved: true,
        documentId: String(
          metaConnection._id
        ),
        savedFacebookPages:
          updatedConnection.facebookPages || [],
        savedInstagramAccounts:
          updatedConnection.instagramAccounts ||
          [],
      },
    });
  } catch (error) {
    console.error(
      "Meta assets diagnostic error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while diagnosing Meta assets",
        message: error.message,
      },
      { status: 500 }
    );
  }
}