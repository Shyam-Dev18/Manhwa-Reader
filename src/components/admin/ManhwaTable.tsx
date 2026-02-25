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

interface RowItem {
  title: string;
  slug: string;
  status: "ongoing" | "completed" | "hiatus" | "dropped";
  rating: number;
  genres: string[];
}

interface ManhwaTableProps {
  items: RowItem[];
}

export default function ManhwaTable({ items }: ManhwaTableProps) {
  const router = useRouter();

  async function handleDelete(slug: string) {
    try {
      const response = await fetch(`/api/admin/manhwa/${slug}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete manhwa");
      }

      toast.success("Manhwa deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-10 text-center text-sm text-gray-400">
        No manhwa found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.slug}>
              <TableCell>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.slug}</div>
              </TableCell>
              <TableCell className="capitalize">{item.status}</TableCell>
              <TableCell>{item.rating.toFixed(1)}</TableCell>
              <TableCell className="max-w-[280px] truncate">{item.genres.join(", ")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/manhwa/${item.slug}/chapters`}>
                    <Button size="sm" variant="secondary">
                      Chapters
                    </Button>
                  </Link>

                  <Link href={`/admin/manhwa/${item.slug}/edit`}>
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
                        <AlertDialogTitle>Delete manhwa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will remove {item.title}.
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
