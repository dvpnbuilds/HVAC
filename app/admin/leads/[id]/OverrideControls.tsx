"use client";

import { useTransition } from "react";
import { overrideEmergency } from "@/app/admin/actions/overrideEmergency";

export function OverrideControls({
  leadId,
  isEmergency,
  override,
}: {
  leadId: string;
  isEmergency: boolean;
  override: boolean | null;
}) {
  const [isPending, startTransition] = useTransition();
  const effective = override ?? isEmergency;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-zinc-600">AI flagged: {isEmergency ? "emergency" : "not emergency"}</span>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => overrideEmergency(leadId, !effective))}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Override: mark as {effective ? "not emergency" : "emergency"}
      </button>
      {override !== null && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => overrideEmergency(leadId, null))}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Clear override
        </button>
      )}
    </div>
  );
}
