import { clientConfig } from "@/client.config";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-semibold" style={{ color: clientConfig.brandColor }}>
        {clientConfig.shopName}
      </h1>
      <p className="mt-2 text-zinc-600">{clientConfig.tagline}</p>
      <p className="mt-4 text-sm text-zinc-500">{clientConfig.phone}</p>
    </div>
  );
}
