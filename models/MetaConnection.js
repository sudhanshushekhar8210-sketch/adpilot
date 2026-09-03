import mongoose from "mongoose";

const MetaConnectionSchema = new mongoose.Schema(
  {
    metaUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    tokenExpiresAt: {
      type: Date,
      default: null,
    },

    connected: {
      type: Boolean,
      default: true,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },

    // ---------------------------------------------
    // Meta Ad Accounts
    // ---------------------------------------------

    adAccounts: [
      {
        id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          default: "",
        },

        account_status: {
          type: Number,
          default: null,
        },

        currency: {
          type: String,
          default: "",
        },

        timezone_name: {
          type: String,
          default: "",
        },
      },
    ],

    // ---------------------------------------------
    // Facebook Pages
    // ---------------------------------------------

    facebookPages: [
      {
        id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          default: "",
        },

        access_token: {
          type: String,
          default: "",
        },

        category: {
          type: String,
          default: "",
        },
      },
    ],

    // ---------------------------------------------
    // Instagram Accounts
    // ---------------------------------------------

    instagramAccounts: [
      {
        id: {
          type: String,
          required: true,
        },

        username: {
          type: String,
          default: "",
        },

        name: {
          type: String,
          default: "",
        },

        profile_picture_url: {
          type: String,
          default: "",
        },

        facebookPageId: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.MetaConnection ||
  mongoose.model(
    "MetaConnection",
    MetaConnectionSchema
  );