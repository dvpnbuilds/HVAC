import { clientConfig } from "@/client.config";
import { LeadIntakeForm } from "@/app/components/LeadIntakeForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold" style={{ color: clientConfig.brandColor }}>
        {clientConfig.shopName}
      </h1>
      <p className="-mt-4 text-zinc-600">{clientConfig.tagline}</p>
      <p className="text-sm text-zinc-500">{clientConfig.phone}</p>
      <LeadIntakeForm />
    </div>
  );
}
