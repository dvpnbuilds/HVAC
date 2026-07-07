"use client";

import { useTransition } from "react";
import { updateStatus } from "@/app/admin/actions/updateStatus";

export function StatusControls({
  leadId,
  currentStatus,
  statuses,
}: {
  leadId: string;
  currentStatus: string;
  statuses: readonly string[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          disabled={isPending || status === currentStatus}
          onClick={() => startTransition(() => updateStatus(leadId, status))}
          className={`rounded px-3 py-1 text-sm disabled:opacity-50 ${
            status === currentStatus ? "bg-zinc-800 text-white" : "border"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
