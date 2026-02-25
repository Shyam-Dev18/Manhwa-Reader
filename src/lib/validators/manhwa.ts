import { z } from "zod";

export const adminManhwaStatusSchema = z.enum([
  "ongoing",
  "completed",
  "hiatus",
  "dropped",
]);

export const adminPublicationStatusSchema = z.enum(["draft", "published"]);

const slugRegex = /^[a-z0-9-]+$/;

export const adminManhwaWriteSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().toLowerCase().regex(slugRegex),
  coverImage: z.url().max(2000),
  synopsis: z.string().trim().min(20).max(5000),
  genres: z.array(z.string().trim().min(1).max(50)).min(1).max(10),
  rating: z.number().finite().min(0).max(10),
  publicationStatus: adminPublicationStatusSchema,
  status: adminManhwaStatusSchema,
});

export const adminManhwaFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),
  coverImage: z.url("Cover URL must be a valid URL").max(2000),
  synopsis: z
    .string()
    .trim()
    .min(20, "Synopsis must be at least 20 characters")
    .max(5000, "Synopsis cannot exceed 5000 characters"),
  genresInput: z.string().trim().min(1, "At least one genre is required"),
  rating: z.number().finite().min(0).max(10),
  publicationStatus: adminPublicationStatusSchema,
  status: adminManhwaStatusSchema,
});

export type AdminManhwaWriteInput = z.infer<typeof adminManhwaWriteSchema>;
export type AdminManhwaFormInput = z.infer<typeof adminManhwaFormSchema>;

export function parseGenresInput(input: string) {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);
}
