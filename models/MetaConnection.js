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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MetaConnection ||
  mongoose.model("MetaConnection", MetaConnectionSchema);