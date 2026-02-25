"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  adminManhwaFormSchema,
  parseGenresInput,
  type AdminManhwaFormInput,
} from "@/lib/validators/manhwa";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface ManhwaFormProps {
  mode: "create" | "edit";
  currentSlug?: string;
  initialValues?: {
    title: string;
    slug: string;
    coverImage: string;
    synopsis: string;
    genres: string[];
    rating: number;
    publicationStatus: "draft" | "published";
    status: "ongoing" | "completed" | "hiatus" | "dropped";
  };
}

export default function ManhwaForm({ mode, currentSlug, initialValues }: ManhwaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugCheckState, setSlugCheckState] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminManhwaFormInput>({
    resolver: zodResolver(adminManhwaFormSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      coverImage: initialValues?.coverImage ?? "",
      synopsis: initialValues?.synopsis ?? "",
      genresInput: initialValues?.genres.join(", ") ?? "",
      rating: initialValues?.rating ?? 0,
      publicationStatus: initialValues?.publicationStatus ?? "draft",
      status: initialValues?.status ?? "ongoing",
    },
  });

  const slugField = register("slug");

  async function validateSlugUniqueness(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      setSlugCheckState("idle");
      return;
    }

    if (mode === "edit" && currentSlug === normalized) {
      setSlugCheckState("available");
      return;
    }

    setSlugCheckState("checking");

    try {
      const res = await fetch(
        `/api/admin/manhwa/slug-check?slug=${encodeURIComponent(normalized)}`
      );
      const data = (await res.json()) as { available?: boolean };
      setSlugCheckState(data.available ? "available" : "taken");
    } catch {
      setSlugCheckState("idle");
    }
  }

  async function onSubmit(values: AdminManhwaFormInput) {
    setIsSubmitting(true);

    const payload = {
      title: values.title,
      slug: values.slug,
      coverImage: values.coverImage,
      synopsis: values.synopsis,
      genres: parseGenresInput(values.genresInput),
      rating: values.rating,
      publicationStatus: values.publicationStatus,
      status: values.status,
    };

    if (slugCheckState === "taken") {
      toast.error("Slug already exists");
      setIsSubmitting(false);
      return;
    }

    const endpoint =
      mode === "create" ? "/api/admin/manhwa" : `/api/admin/manhwa/${currentSlug}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { slug?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save manhwa");
      }

      toast.success(mode === "create" ? "Manhwa created" : "Manhwa updated");

      if (data?.slug) {
        if (mode === "create") {
          router.push(`/admin/manhwa/${data.slug}/edit`);
        } else {
          router.push(`/admin/manhwa/${data.slug}/edit`);
        }
      }

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          {...slugField}
          onBlur={(e) => {
            slugField.onBlur(e);
            void validateSlugUniqueness(e.target.value);
          }}
        />
        {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
        {slugCheckState === "checking" && (
          <p className="text-xs text-gray-500">Checking slug availability...</p>
        )}
        {slugCheckState === "available" && (
          <p className="text-xs text-green-400">Slug is available</p>
        )}
        {slugCheckState === "taken" && (
          <p className="text-xs text-red-400">Slug is already taken</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover URL</Label>
        <Input id="coverImage" {...register("coverImage")} />
        {errors.coverImage && (
          <p className="text-xs text-red-400">{errors.coverImage.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="synopsis">Synopsis / Story</Label>
        <textarea
          id="synopsis"
          rows={6}
          {...register("synopsis")}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        {errors.synopsis && (
          <p className="text-xs text-red-400">{errors.synopsis.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="genresInput">Genres (comma separated)</Label>
        <Input id="genresInput" {...register("genresInput")} />
        {errors.genresInput && (
          <p className="text-xs text-red-400">{errors.genresInput.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0 - 10)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            {...register("rating", { valueAsNumber: true })}
          />
          {errors.rating && <p className="text-xs text-red-400">{errors.rating.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Publication</Label>
          <Controller
            control={control}
            name="publicationStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select publication status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.publicationStatus && (
            <p className="text-xs text-red-400">{errors.publicationStatus.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hiatus">Hiatus</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
          ? "Create Manhwa"
          : "Save Changes"}
      </Button>
    </form>
  );
}
