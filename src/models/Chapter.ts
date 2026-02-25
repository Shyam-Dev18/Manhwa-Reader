import mongoose, { Schema, type Model } from "mongoose";

/**
 * Sub-document schema for a single chapter page/image.
 * Storing width/height prevents Cumulative Layout Shift (CLS)
 * by reserving the correct aspect ratio before the image loads.
 */
const chapterImageSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    width: {
      type: Number,
      required: [true, "Image width is required for CLS prevention"],
      min: 1,
    },
    height: {
      type: Number,
      required: [true, "Image height is required for CLS prevention"],
      min: 1,
    },
    order: {
      type: Number,
      required: [true, "Image order is required"],
      min: 0,
    },
  },
  { _id: false } // No need for sub-document IDs
);

/**
 * Chapter document interface for Mongoose.
 */
export interface IChapter {
  manhwaSlug: string;
  chapterNumber: number;
  title?: string;
  slug: string;
  images: {
    url: string;
    width: number;
    height: number;
    order: number;
  }[];
  createdAt: Date;
}

const chapterSchema = new Schema<IChapter>(
  {
    manhwaSlug: {
      type: String,
      required: [true, "manhwaSlug is required"],
      lowercase: true,
      trim: true,
      // NOT a Mongoose ref — we use string slugs to avoid .populate()
      // overhead. Queries join on manhwaSlug directly.
    },

    chapterNumber: {
      type: Number,
      required: [true, "Chapter number is required"],
      min: [0, "Chapter number cannot be negative"],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [300, "Chapter title cannot exceed 300 characters"],
    },

    slug: {
      type: String,
      required: [true, "Chapter slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Format: {manhwa-slug}-chapter-{number}
      // e.g., "solo-leveling-chapter-15"
    },

    images: {
      type: [chapterImageSchema],
      default: [],
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: "Chapter must have at least one image",
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    // Chapters are immutable once created — no updatedAt needed.
    // If images change, a new chapter document can be created.
  }
);

// ──────────────────────────────────────────────
// INDEXES
// ──────────────────────────────────────────────
// slug index is auto-created by `unique: true` on the field definition.

// Compound index — chapter list for a manhwa, sorted by chapter number
// Also powers prev/next navigation queries
chapterSchema.index({ manhwaSlug: 1, chapterNumber: 1 }, { unique: true });

/**
 * Guard against model re-compilation during Next.js hot reload.
 */
const Chapter: Model<IChapter> =
  mongoose.models.Chapter ||
  mongoose.model<IChapter>("Chapter", chapterSchema);

export default Chapter;
