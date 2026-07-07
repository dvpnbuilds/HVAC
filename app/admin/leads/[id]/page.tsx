import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/repo/leads";
import { getTriageResultForLead } from "@/lib/repo/triageResult";
import { getActionLogsForLead } from "@/lib/repo/actionLog";
import { getFollowUpDraftsForLead } from "@/lib/repo/followUpDraft";
import { STATUS_OPTIONS } from "@/lib/leadStatus";
import { StatusControls } from "./StatusControls";
import { OverrideControls } from "./OverrideControls";
import { FollowUpDrafts } from "./FollowUpDrafts";
import { RegenerateTriageButton } from "./RegenerateTriageButton";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const triage = await getTriageResultForLead(id);
  const logs = await getActionLogsForLead(id);
  const drafts = await getFollowUpDraftsForLead(id);
  const effectiveEmergency = triage?.emergencyOverride ?? triage?.isEmergency ?? false;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{lead.name}</h1>
        {effectiveEmergency && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white">EMERGENCY</span>
        )}
      </div>
      <div className="text-sm text-zinc-500">
        {lead.serviceType} · {lead.location} · {lead.phone ?? lead.email}
      </div>

      <StatusControls leadId={lead.id} currentStatus={lead.status} statuses={STATUS_OPTIONS} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded border p-3">
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">Raw customer input</h2>
          <p className="whitespace-pre-wrap text-sm">{lead.rawInput}</p>
        </div>
        <div className="rounded border p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-zinc-600">AI summary</h2>
            <RegenerateTriageButton leadId={lead.id} />
          </div>
          {triage ? (
            <div className="flex flex-col gap-1 text-sm">
              <p>
                <span className="font-medium">Classification:</span> {triage.classification}
              </p>
              <p>
                <span className="font-medium">SLA:</span> {triage.slaHint}
              </p>
              <p className="whitespace-pre-wrap">{triage.serviceNotes}</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Pending — AI unavailable.</p>
          )}
        </div>
      </div>

      {triage && (
        <OverrideControls
          leadId={lead.id}
          isEmergency={triage.isEmergency}
          override={triage.emergencyOverride}
        />
      )}

      <FollowUpDrafts leadId={lead.id} leadEmail={lead.email} drafts={drafts} />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-zinc-600">Timeline</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {logs.map((log) => (
            <li key={log.id} className="flex flex-wrap gap-2">
              <span className="text-zinc-400">{log.createdAt.toLocaleString()}</span>
              <span>
                {log.action}
                {log.detail ? ` — ${log.detail}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
