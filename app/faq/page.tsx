import Link from "next/link";
import { clientConfig } from "@/client.config";

export default function FaqPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: clientConfig.brandColor }}>
          {clientConfig.shopName} — FAQ
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Serving {clientConfig.serviceArea.join(", ")} · {clientConfig.phone}
        </p>
      </div>

      <dl className="flex flex-col gap-4">
        {clientConfig.faq.map((item) => (
          <div key={item.question} className="rounded border p-3">
            <dt className="font-medium">{item.question}</dt>
            <dd className="mt-1 text-sm text-zinc-600">{item.answer}</dd>
          </div>
        ))}
      </dl>

      <Link href="/" className="text-sm underline">
        Back to intake form
      </Link>
    </div>
  );
}
