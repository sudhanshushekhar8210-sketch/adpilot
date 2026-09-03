import mongoose from "mongoose";

const MetaConnectionSchema = new mongoose.Schema(
  {
    // Meta / Facebook User ID
    metaUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Encrypted Meta Access Token
    accessToken: {
      type: String,
      required: true,
    },

    // Token expiry
    tokenExpiresAt: {
      type: Date,
      default: null,
    },

    // Connection status
    connected: {
      type: Boolean,
      default: true,
    },

    // Connection date
    connectedAt: {
      type: Date,
      default: Date.now,
    },

    // Meta Ad Accounts
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MetaConnection ||
  mongoose.model("MetaConnection", MetaConnectionSchema);