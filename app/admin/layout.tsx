import { clientConfig } from "@/client.config";
import { logout } from "@/app/admin/actions/logout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <span className="font-semibold" style={{ color: clientConfig.brandColor }}>
          {clientConfig.shopName} — Admin
        </span>
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 underline">
            Log out
          </button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
