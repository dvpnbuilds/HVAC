"use client";

import { useState, useTransition } from "react";
import { generateDraft } from "./actions/generateDraft";
import { updateDraftContent } from "./actions/updateDraft";
import { DRAFT_TYPES, type DraftType } from "@/lib/followUpDraftType";

type Draft = {
  id: string;
  type: string;
  variant: string;
  content: string;
};

export function FollowUpDrafts({
  leadId,
  leadEmail,
  drafts,
}: {
  leadId: string;
  leadEmail: string | null;
  drafts: Draft[];
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingType, setPendingType] = useState<DraftType | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleGenerate(type: DraftType) {
    setPendingType(type);
    startTransition(async () => {
      await generateDraft(leadId, type);
      setPendingType(null);
    });
  }

  function handleSave(draftId: string) {
    const content = edits[draftId];
    if (content === undefined) return;
    startTransition(async () => {
      await updateDraftContent(leadId, draftId, content);
    });
  }

  async function handleCopy(draftId: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(draftId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-zinc-600">Follow-up drafts</h2>
      <div className="flex flex-wrap gap-2">
        {DRAFT_TYPES.map(({ key, label }) => (
          <button
            key={key}
            disabled={isPending}
            onClick={() => handleGenerate(key)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            {isPending && pendingType === key ? "Generating…" : `Generate ${label}`}
          </button>
        ))}
      </div>

      {drafts.length === 0 && (
        <p className="text-sm text-zinc-500">No drafts generated yet.</p>
      )}

      {DRAFT_TYPES.map(({ key, label }) => {
        const typeDrafts = drafts.filter((d) => d.type === key);
        if (typeDrafts.length === 0) return null;

        return (
          <div key={key} className="rounded border p-3">
            <h3 className="mb-2 text-sm font-semibold">{label}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {typeDrafts.map((draft) => {
                const value = edits[draft.id] ?? draft.content;
                return (
                  <div key={draft.id} className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-zinc-400">{draft.variant}</span>
                    <textarea
                      value={value}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [draft.id]: e.target.value }))
                      }
                      rows={draft.variant === "sms" ? 3 : 6}
                      className="w-full rounded border p-2 text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={isPending}
                        onClick={() => handleSave(draft.id)}
                        className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                      >
                        Save edit
                      </button>
                      <button
                        onClick={() => handleCopy(draft.id, value)}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        {copiedId === draft.id ? "Copied!" : "Copy"}
                      </button>
                      {draft.variant === "email" && leadEmail && (
                        <a
                          href={`mailto:${leadEmail}?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(value)}`}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          Open in email
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
