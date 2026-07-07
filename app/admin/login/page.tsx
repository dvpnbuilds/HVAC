import { clientConfig } from "@/client.config";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-xl font-semibold">{clientConfig.shopName} — Admin login</h1>
      <LoginForm />
    </div>
  );
}
