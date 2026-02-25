import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

export const chapterImageSchema = z.object({
  url: z.url("Image URL must be valid").max(2000),
  width: z.number().int().min(1, "Width must be >= 1"),
  height: z.number().int().min(1, "Height must be >= 1"),
  order: z.number().int().min(0, "Order must be >= 0"),
});

export const adminChapterWriteSchema = z.object({
  chapterNumber: z.number().int().min(0),
  title: z.string().trim().max(300).optional().or(z.literal("")),
  slug: z.string().trim().toLowerCase().regex(slugRegex),
  images: z.array(chapterImageSchema).min(1, "At least one image is required"),
}).refine(
  (data) => new Set(data.images.map((img) => img.order)).size === data.images.length,
  {
    message: "Image order values must be unique",
    path: ["images"],
  }
);

export const adminChapterFormSchema = z.object({
  chapterNumber: z.number().int().min(0, "Chapter number must be >= 0"),
  title: z.string().trim().max(300).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),
  images: z.array(
    z.object({
      url: z.url("Image URL must be valid").max(2000),
      width: z.number().int().min(1, "Width must be >= 1"),
      height: z.number().int().min(1, "Height must be >= 1"),
      order: z.number().int().min(0, "Order must be >= 0"),
    })
  ).min(1, "At least one image is required"),
}).refine(
  (data) => new Set(data.images.map((img) => img.order)).size === data.images.length,
  {
    message: "Image order values must be unique",
    path: ["images"],
  }
);

export type AdminChapterWriteInput = z.infer<typeof adminChapterWriteSchema>;
export type AdminChapterFormInput = z.infer<typeof adminChapterFormSchema>;

export function sortImagesAscending<T extends { order: number }>(images: T[]) {
  return [...images].sort((a, b) => a.order - b.order);
}
