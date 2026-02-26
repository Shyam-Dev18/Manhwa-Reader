import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
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

      <p>
        This Privacy Policy explains how {siteConfig.name} (“we,” “our,” or “us”)
        handles information when you use the site.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We do not require accounts for browsing the public site and we do not
        intentionally collect personally identifiable information (PII) from
        casual visitors. We may log basic, non-identifying usage data (for
        example page views, device type, and referrer) to understand performance
        and improve the user experience.
      </p>

      <h2>Cookies</h2>
      <p>
        This website may use essential cookies required for the site to
        function. We do not use tracking cookies or third-party advertising
        cookies.
      </p>

      <h2>Authentication (Admin Only)</h2>
      <p>
        If you access the admin area, we store authentication tokens and related
        security data to keep your session secure. These are used only to manage
        site content and are not shared with third parties.
      </p>

      <h2>Third-Party Content</h2>
      <p>
        Images displayed on this site are loaded from external third-party
        servers. We do not host, store, or modify any copyrighted content on
        our servers.
      </p>

      <h2>Data Retention</h2>
      <p>
        Non-identifying analytics and security logs are retained only as long
        as needed for operational and security purposes.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable safeguards to protect the site and admin access.
        However, no method of transmission or storage is 100% secure.
      </p>

      <h2>Children’s Privacy</h2>
      <p>
        This site is not directed to children under 13, and we do not knowingly
        collect personal information from children.
      </p>

      <h2>External Links</h2>
      <p>
        Our site may contain links to external websites. We are not responsible
        for the privacy practices of those sites.
      </p>

      <h2>International Visitors</h2>
      <p>
        If you access the site from outside your country, your information may
        be processed in regions where our infrastructure is located.
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
