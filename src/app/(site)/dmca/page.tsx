import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/utils/seo";

export const metadata: Metadata = buildMetadata({
  title: "DMCA Notice & Takedown Policy",
  description:
    "DMCA takedown policy for ManhwaVerse. Learn how to report copyrighted content.",
  path: "/dmca",
  noIndex: true,
});

export default function DmcaPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl px-4 py-12">
      <h1>DMCA Notice &amp; Takedown Policy</h1>
      <p className="text-gray-400">Last updated: February 2026</p>

      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 not-prose mb-8">
        <p className="text-sm text-yellow-200">
          <strong>Disclaimer:</strong> {siteConfig.name} does not store any
          files on its server. All content displayed on this site is hosted by
          and served from third-party servers that are not affiliated with or
          controlled by {siteConfig.name}.
        </p>
      </div>

      <h2>What is the DMCA?</h2>
      <p>
        The Digital Millennium Copyright Act (DMCA) is a United States copyright
        law that provides a process for copyright owners to request the removal
        of infringing content from online platforms.
      </p>

      <h2>Our Position</h2>
      <p>
        {siteConfig.name} respects the intellectual property rights of others.
        We act as an index/directory that links to content hosted on external
        third-party servers. We do not upload, host, or store any copyrighted
        material on our servers.
      </p>

      <h2>Filing a DMCA Takedown Notice</h2>
      <p>
        If you believe that content accessible through our site infringes your
        copyright, please send a DMCA takedown notice with the following
        information:
      </p>
      <ol>
        <li>
          A description of the copyrighted work you claim has been infringed.
        </li>
        <li>
          The specific URL(s) on our site where the allegedly infringing
          content can be found.
        </li>
        <li>Your full legal name and contact information (email address).</li>
        <li>
          A statement that you have a good faith belief that the use of the
          material is not authorized by the copyright owner, its agent, or the
          law.
        </li>
        <li>
          A statement, under penalty of perjury, that the information in the
          notification is accurate and that you are the copyright owner or
          authorized to act on behalf of the owner.
        </li>
        <li>Your physical or electronic signature.</li>
      </ol>

      <h2>Contact for DMCA Notices</h2>
      <p>
        Please send your DMCA takedown notice via email to:{" "}
        <strong>[your-email@example.com]</strong>
      </p>

      <h2>Response Time</h2>
      <p>
        We aim to process valid DMCA takedown requests within{" "}
        <strong>48-72 hours</strong> of receiving a complete and valid notice.
        Links to the reported content will be removed from our index upon
        verification.
      </p>

      <h2>Repeat Infringers</h2>
      <p>
        We maintain a policy of terminating access to content that is
        repeatedly reported for copyright infringement.
      </p>
    </article>
  );
}
