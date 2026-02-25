"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={
        className ||
        "inline-flex h-10 items-center justify-center rounded-lg bg-gray-800 px-4 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-700"
      }
    >
      Logout
    </button>
  );
}
