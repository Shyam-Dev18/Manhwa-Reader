import mongoose, { Schema, type Model } from "mongoose";

/**
 * Manhwa document interface for Mongoose.
 * Mirrors the TypeScript `Manhwa` type from @/types but uses
 * native Date objects (Mongoose handles serialization).
 */
export interface IManhwa {
  title: string;
  alternativeTitles: string[];
  slug: string;
  publicationStatus: "draft" | "published";
  status: "ongoing" | "completed" | "hiatus" | "dropped";
  rating: number;
  synopsis: string;
  authors: string[];
  artists: string[];
  genres: string[];
  studio: string;
  releaseYear: number;
  coverImage: string;
  bannerImage?: string;
  totalChapters: number;
  latestChapterNumber: number;
  externalSourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const manhwaSchema = new Schema<IManhwa>(
  {
    title: {
      type: String,
      required: [true, "Manhwa title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },

    alternativeTitles: {
      type: [String],
      default: [],
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug must be URL-safe (lowercase, hyphens, numbers)"],
    },

    publicationStatus: {
      type: String,
      required: true,
      enum: {
        values: ["draft", "published"],
        message: "Publication status must be draft or published",
      },
      default: "published",
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["ongoing", "completed", "hiatus", "dropped"],
        message: "Status must be: ongoing, completed, hiatus, or dropped",
      },
      default: "ongoing",
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [10, "Rating cannot exceed 10"],
    },

    synopsis: {
      type: String,
      default: "",
      maxlength: [5000, "Synopsis cannot exceed 5000 characters"],
    },

    authors: {
      type: [String],
      default: [],
    },

    artists: {
      type: [String],
      default: [],
    },

    genres: {
      type: [String],
      default: [],
    },

    studio: {
      type: String,
      default: "",
      trim: true,
    },

    releaseYear: {
      type: Number,
      default: 0,
    },

    coverImage: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
    },

    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
    },

    latestChapterNumber: {
      type: Number,
      default: 0,
      min: 0,
    },

    externalSourceUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Auto-manages createdAt & updatedAt
  }
);

// ──────────────────────────────────────────────
// INDEXES
// ──────────────────────────────────────────────
// slug index is auto-created by `unique: true` on the field definition.

// Home page query — sort by latest updates, filter by status
manhwaSchema.index({ status: 1, updatedAt: -1 });

// Public visibility filtering
manhwaSchema.index({ publicationStatus: 1, updatedAt: -1 });

// Genre filtering (future genre pages)
manhwaSchema.index({ genres: 1 });

// Text search on title + alt titles + genres
manhwaSchema.index(
  {
    title: "text",
    alternativeTitles: "text",
    genres: "text",
  },
  { name: "manhwa_text_search" }
);

/**
 * Guard against model re-compilation during Next.js hot reload.
 * `mongoose.models.Manhwa` will be defined after the first import;
 * subsequent hot reloads reuse it instead of calling `model()` again.
 */
const Manhwa: Model<IManhwa> =
  mongoose.models.Manhwa || mongoose.model<IManhwa>("Manhwa", manhwaSchema);

export default Manhwa;
