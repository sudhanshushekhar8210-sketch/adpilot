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

    const metaConnection = await MetaConnection.findOne({
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
    // STEP 3: Decrypt Meta Access Token
    // ---------------------------------------------

    const accessToken = decryptToken(
      metaConnection.accessToken
    );

    // ---------------------------------------------
    // STEP 4: Fetch Ad Accounts from Meta
    // ---------------------------------------------

    const adAccountsUrl = new URL(
      "https://graph.facebook.com/v23.0/me/adaccounts"
    );

    adAccountsUrl.searchParams.set(
      "fields",
      "id,name,account_status,currency,timezone_name"
    );

    adAccountsUrl.searchParams.set(
      "access_token",
      accessToken
    );

    const response = await fetch(
      adAccountsUrl.toString(),
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error(
        "Meta Ad Accounts API error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch Meta Ad Accounts",
          details: data,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // STEP 5: Prepare Ad Accounts
    // ---------------------------------------------

    const adAccounts = Array.isArray(data.data)
      ? data.data
      : [];

    // ---------------------------------------------
    // STEP 6: Explicitly UPDATE MongoDB
    // ---------------------------------------------

    const updatedConnection =
      await MetaConnection.findOneAndUpdate(
        {
          _id: metaConnection._id,
        },
        {
          $set: {
            adAccounts: adAccounts,
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
          error: "Failed to update MetaConnection in MongoDB",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // STEP 7: Verify MongoDB data
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

      count: adAccounts.length,

      adAccounts,

      mongoDB: {
        saved: true,
        documentId: String(metaConnection._id),
        savedAdAccounts:
          savedConnection?.adAccounts || [],
        savedCount:
          savedConnection?.adAccounts?.length || 0,
      },
    });
  } catch (error) {
    console.error(
      "Ad Accounts route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while fetching Ad Accounts",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}