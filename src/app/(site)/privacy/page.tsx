import type { Metadata } from "next";
import { buildMetadata } from "@/utils/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for ManhwaVerse. Learn how we handle your data.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
      <h1>Privacy Policy</h1>
      <p className="text-gray-400">Last updated: February 2026</p>

      <h2>Information We Collect</h2>
      <p>
        We do not collect personal information from our visitors. We may use
        basic analytics (page views, device type) to improve the user
        experience. No personally identifiable information (PII) is stored.
      </p>

      <h2>Cookies</h2>
      <p>
        This website may use essential cookies required for the site to
        function. We do not use tracking cookies or third-party advertising
        cookies.
      </p>

      <h2>Third-Party Content</h2>
      <p>
        Images displayed on this site are loaded from external third-party
        servers. We do not host, store, or modify any copyrighted content on
        our servers.
      </p>

      <h2>External Links</h2>
      <p>
        Our site may contain links to external websites. We are not responsible
        for the privacy practices of those sites.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. Changes will be
        posted on this page with an updated revision date.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this privacy policy, please reach out
        through our DMCA page.
      </p>
    </article>
  );
}
