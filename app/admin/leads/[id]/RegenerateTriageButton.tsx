"use client";

import { useTransition } from "react";
import { regenerateTriage } from "./actions/regenerateTriage";

export function RegenerateTriageButton({ leadId }: { leadId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => regenerateTriage(leadId))}
      className="rounded border px-2 py-1 text-xs disabled:opacity-50"
    >
      {isPending ? "Regenerating…" : "Regenerate triage"}
    </button>
  );
}
