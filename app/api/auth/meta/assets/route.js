import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MetaConnection from "@/models/MetaConnection";
import { decryptToken } from "@/lib/encryption";

export async function GET() {
  try {
    // ---------------------------------------------
    // STEP 1: Connect MongoDB
    // ---------------------------------------------

    await connectDB();

    // ---------------------------------------------
    // STEP 2: Find connected Meta account
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
    // STEP 3: Decrypt access token
    // ---------------------------------------------

    const accessToken = decryptToken(
      metaConnection.accessToken
    );

    // ---------------------------------------------
    // STEP 4: Fetch Facebook Pages
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

    if (!pagesResponse.ok || pagesData.error) {
      console.error(
        "Meta Pages API error:",
        pagesData
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch Facebook Pages",
          details: pagesData,
        },
        { status: 400 }
      );
    }

    const facebookPages = Array.isArray(
      pagesData.data
    )
      ? pagesData.data
      : [];

    // ---------------------------------------------
    // STEP 5: Fetch Instagram accounts
    // ---------------------------------------------

    const instagramAccounts = [];

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

        // -----------------------------------------
        // Fetch Instagram profile information
        // -----------------------------------------

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
    // STEP 6: Save assets in MongoDB
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
            "Failed to save Meta assets in MongoDB",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // STEP 7: Verify saved data
    // ---------------------------------------------

    const savedConnection =
      await MetaConnection.findById(
        metaConnection._id
      ).lean();

    // ---------------------------------------------
    // STEP 8: Return result
    // ---------------------------------------------

    return NextResponse.json({
      success: true,

      facebookPages: {
        count: facebookPages.length,
        data: facebookPages,
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
          savedConnection?.facebookPages || [],
        savedInstagramAccounts:
          savedConnection?.instagramAccounts ||
          [],
      },
    });
  } catch (error) {
    console.error(
      "Meta assets route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while fetching Meta assets",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}