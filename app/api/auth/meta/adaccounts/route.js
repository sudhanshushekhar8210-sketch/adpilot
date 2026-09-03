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
    // STEP 2: Get latest connected Meta account
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
    // STEP 4: Get Ad Accounts from Meta
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
    // STEP 5: Save Ad Accounts in MongoDB
    // ---------------------------------------------

    const adAccounts = data.data || [];

    metaConnection.adAccounts = adAccounts;

    await metaConnection.save();

    // ---------------------------------------------
    // STEP 6: Return Ad Accounts
    // ---------------------------------------------

    return NextResponse.json({
      success: true,
      count: adAccounts.length,
      adAccounts,
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
      },
      { status: 500 }
    );
  }
}