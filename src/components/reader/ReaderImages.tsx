"use client";

import { useState } from "react";
import { FALLBACK_IMAGES } from "@/config/constants";
import { buildWeservUrl } from "@/utils/images";

interface ReaderImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

/**
 * Single reader page image with error fallback.
 * Client component — handles onError to swap broken images.
 *
 * Uses width/height to compute aspect ratio placeholder,
 * preventing Cumulative Layout Shift (CLS).
 */
function ReaderImage({ src, alt, width, height, priority }: ReaderImageProps) {
  const originalSrc = typeof src === "string" ? src.trim() : "";
  const proxiedSrc = buildWeservUrl(originalSrc);
  const initialSrc = proxiedSrc || originalSrc || FALLBACK_IMAGES.CHAPTER;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative w-full bg-gray-900"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {hasError ? (
        <div className="flex h-full items-center justify-center bg-gray-800 text-sm text-gray-500">
          Image failed to load
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          fetchPriority={priority ? "high" : "auto"}
          className="h-auto w-full"
          onError={() => {
            if (imgSrc === proxiedSrc && originalSrc && originalSrc !== proxiedSrc) {
              setImgSrc(originalSrc);
              return;
            }

            if (imgSrc !== FALLBACK_IMAGES.CHAPTER) {
              setImgSrc(FALLBACK_IMAGES.CHAPTER);
              return;
            }

            setHasError(true);
          }}
        />
      )}
    </div>
  );
}

// ─── Container ───────────────────────────────────────────────

interface ReaderImagesProps {
  images: {
    url: string;
    width: number;
    height: number;
    order: number;
  }[];
  chapterTitle: string;
}

/**
 * Vertically stacked chapter images for the reader.
 *
 * - First 2 images: eager loaded (above fold on most devices)
 * - Remaining images: lazy loaded with aspect-ratio placeholder
 * - No gaps between images for immersive reading
 */
export default function ReaderImages({
  images,
  chapterTitle,
}: ReaderImagesProps) {
  // Sort by order to guarantee correct sequence
  const sorted = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col items-center">
      {sorted.map((img, index) => (
        <ReaderImage
          key={`${img.order}-${img.url}`}
          src={img.url}
          alt={`${chapterTitle} - Page ${img.order}`}
          width={img.width}
          height={img.height}
          priority={index < 2}
        />
      ))}
    </div>
  );
}
