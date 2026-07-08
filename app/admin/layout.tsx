import { AdminHeader } from "@/app/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
