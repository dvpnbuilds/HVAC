"use client";

import { usePathname } from "next/navigation";
import { clientConfig } from "@/client.config";
import { logout } from "@/app/admin/actions/logout";

export function AdminHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <header className="flex items-center justify-between border-b p-4">
      <span className="font-semibold" style={{ color: clientConfig.brandColor }}>
        {clientConfig.shopName} — Admin
      </span>
      {!isLoginPage && (
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 underline">
            Log out
          </button>
        </form>
      )}
    </header>
  );
}
