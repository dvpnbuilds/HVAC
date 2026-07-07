import Link from "next/link";
import { clientConfig } from "@/client.config";
import { getAllLeads } from "@/lib/repo/leads";
import { STATUS_OPTIONS } from "@/lib/leadStatus";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; emergency?: string }>;
}) {
  const params = await searchParams;
  const leads = await getAllLeads();

  const filtered = leads.filter((lead) => {
    const effectiveEmergency =
      lead.triageResult?.emergencyOverride ?? lead.triageResult?.isEmergency ?? false;
    if (params.status && lead.status !== params.status) return false;
    if (params.emergency === "1" && !effectiveEmergency) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{clientConfig.shopName} — Leads</h1>

      <form className="flex flex-wrap items-center gap-2 text-sm" method="get">
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded border px-2 py-1"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="emergency" value="1" defaultChecked={params.emergency === "1"} />
          Emergency only
        </label>
        <button type="submit" className="rounded bg-zinc-800 px-3 py-1 text-white">
          Filter
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {filtered.map((lead) => {
          const effectiveEmergency =
            lead.triageResult?.emergencyOverride ?? lead.triageResult?.isEmergency ?? false;
          return (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="flex flex-col gap-1 rounded border p-3 hover:bg-zinc-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{lead.name}</span>
                  {effectiveEmergency && (
                    <span className="rounded bg-red-600 px-2 py-0.5 text-xs text-white">
                      EMERGENCY
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  {lead.serviceType} · {lead.location} · {lead.status}
                </div>
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && leads.length === 0 && (
          <li className="text-sm text-zinc-500">
            No leads yet — submitted leads will show up here.
          </li>
        )}
        {filtered.length === 0 && leads.length > 0 && (
          <li className="text-sm text-zinc-500">No leads match this filter.</li>
        )}
      </ul>
    </div>
  );
}
