"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
}

export default function BackButton({
  fallbackHref = "/admin",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <Button type="button" variant="outline" className={className} onClick={handleBack}>
      Back
    </Button>
  );
}