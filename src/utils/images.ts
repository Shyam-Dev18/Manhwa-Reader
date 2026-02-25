const WESERV_HOST = "images.weserv.nl";

/**
 * Build a weserv.nl proxy URL from a source image URL.
 *
 * - Removes protocol (http/https)
 * - Prevents double-wrapping existing weserv URLs
 * - Falls back to the original value when malformed
 */
export function buildWeservUrl(originalUrl: string): string {
  if (typeof originalUrl !== "string") {
    return "";
  }

  const trimmed = originalUrl.trim();
  if (!trimmed) {
    return "";
  }

  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  if (withoutProtocol.startsWith(`${WESERV_HOST}/`)) {
    return trimmed;
  }

  return `https://${WESERV_HOST}/?url=${encodeURIComponent(withoutProtocol)}&w=1200&output=webp&q=85`;
}
