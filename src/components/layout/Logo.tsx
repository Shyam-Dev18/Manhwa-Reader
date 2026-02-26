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
      <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-sky-300 to-red-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)] sm:text-[1.75rem]">
        {siteConfig.name}
      </span>
    </Link>
  );
}
