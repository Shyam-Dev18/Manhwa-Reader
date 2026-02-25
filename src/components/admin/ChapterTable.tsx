"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

interface ChapterRow {
  chapterNumber: number;
  title?: string;
  slug: string;
  imageCount: number;
}

interface ChapterTableProps {
  manhwaSlug: string;
  items: ChapterRow[];
}

export default function ChapterTable({ manhwaSlug, items }: ChapterTableProps) {
  const router = useRouter();

  async function handleDelete(chapterSlug: string) {
    try {
      const response = await fetch(
        `/api/admin/manhwa/${manhwaSlug}/chapters/${chapterSlug}`,
        { method: "DELETE" }
      );

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete chapter");
      }

      toast.success("Chapter deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-10 text-center text-sm text-gray-400">
        No chapters found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chapter</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Images</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.slug}>
              <TableCell>{item.chapterNumber}</TableCell>
              <TableCell className="max-w-[220px] truncate">{item.slug}</TableCell>
              <TableCell>{item.title || "—"}</TableCell>
              <TableCell>{item.imageCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/manhwa/${manhwaSlug}/chapters/${item.slug}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete chapter?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Chapter {item.chapterNumber} will be removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.slug)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
