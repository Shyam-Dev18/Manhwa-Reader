"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  adminChapterFormSchema,
  sortImagesAscending,
  type AdminChapterFormInput,
} from "@/lib/validators/chapter";
import { Button, Input, Label } from "@/components/ui";

interface ChapterFormProps {
  mode: "create" | "edit";
  manhwaSlug: string;
  currentChapterSlug?: string;
  initialValues?: AdminChapterFormInput;
}

const EMPTY_IMAGE = { url: "", width: 720, height: 1080, order: 1 };

export default function ChapterForm({
  mode,
  manhwaSlug,
  currentChapterSlug,
  initialValues,
}: ChapterFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminChapterFormInput>({
    resolver: zodResolver(adminChapterFormSchema),
    defaultValues: initialValues ?? {
      chapterNumber: 1,
      title: "",
      slug: `${manhwaSlug}-chapter-1`,
      images: [EMPTY_IMAGE],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  async function onSubmit(values: AdminChapterFormInput) {
    setIsSubmitting(true);

    const payload = {
      chapterNumber: values.chapterNumber,
      title: values.title?.trim() || "",
      slug: values.slug,
      images: sortImagesAscending(values.images),
    };

    const endpoint =
      mode === "create"
        ? `/api/admin/manhwa/${manhwaSlug}/chapters`
        : `/api/admin/manhwa/${manhwaSlug}/chapters/${currentChapterSlug}`;
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
        throw new Error(data?.error || "Failed to save chapter");
      }

      toast.success(mode === "create" ? "Chapter created" : "Chapter updated");

      if (data?.slug) {
        router.push(`/admin/manhwa/${manhwaSlug}/chapters/${data.slug}/edit`);
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="chapterNumber">Chapter Number</Label>
          <Input
            id="chapterNumber"
            type="number"
            min="0"
            {...register("chapterNumber", { valueAsNumber: true })}
          />
          {errors.chapterNumber && (
            <p className="text-xs text-red-400">{errors.chapterNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title (optional)</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Images</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ ...EMPTY_IMAGE, order: fields.length + 1 })}
          >
            Add Image
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-800 bg-gray-950/60 p-3 sm:grid-cols-10"
            >
              <div className="space-y-1 sm:col-span-4">
                <Label htmlFor={`images.${index}.url`}>URL</Label>
                <Input id={`images.${index}.url`} {...register(`images.${index}.url`)} />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={`images.${index}.width`}>Width</Label>
                <Input
                  id={`images.${index}.width`}
                  type="number"
                  min="1"
                  {...register(`images.${index}.width`, { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor={`images.${index}.height`}>Height</Label>
                <Input
                  id={`images.${index}.height`}
                  type="number"
                  min="1"
                  {...register(`images.${index}.height`, { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <Label htmlFor={`images.${index}.order`}>Order</Label>
                <Input
                  id={`images.${index}.order`}
                  type="number"
                  min="0"
                  {...register(`images.${index}.order`, { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-end sm:col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="w-full"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {errors.images?.message && (
          <p className="text-xs text-red-400">{errors.images.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
          ? "Create Chapter"
          : "Save Chapter"}
      </Button>
    </form>
  );
}
