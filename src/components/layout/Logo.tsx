import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

interface LogoProps {
  href?: string;
  animate?: boolean;
}

export default function Logo({ href = "/", animate = true }: LogoProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2 ${animate ? "logo-intro" : ""}`}
    >
      <Image
        src="/logo.png"
        alt={`${siteConfig.name} logo`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-lg object-cover"
        priority
      />
      <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        {siteConfig.name}
      </span>
    </Link>
  );
}
