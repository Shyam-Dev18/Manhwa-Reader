import mongoose, { Schema, type Model } from "mongoose";

export interface IRateLimit {
  ip: string;
  attempts: number;
  lockUntil?: Date;
}

const rateLimitSchema = new Schema<IRateLimit>(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 1,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

rateLimitSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 });

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", rateLimitSchema);

export default RateLimit;
