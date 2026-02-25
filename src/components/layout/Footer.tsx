import Link from "next/link";
import { siteConfig } from "@/config/site";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo animate={false} />
            <p className="text-sm text-gray-400">
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  DMCA
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          {siteConfig.name} does not store any files on its server. All contents
          are provided by non-affiliated third parties. If you believe your
          copyrighted content is being displayed here, please visit our{" "}
          <Link href="/dmca" className="underline hover:text-gray-300">
            DMCA page
          </Link>{" "}
          for removal instructions.
        </p>
      </div>
    </footer>
  );
}
