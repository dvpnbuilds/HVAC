"use client";

import { useActionState } from "react";
import { clientConfig } from "@/client.config";
import { URGENCY_OPTIONS } from "@/lib/validation/leadForm";
import { submitLead, type SubmitLeadState } from "@/app/actions/submitLead";

const initialState: SubmitLeadState = { errors: {}, success: false };

export function LeadIntakeForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.success) {
    return (
      <div className="w-full max-w-md rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">Request received.</p>
        <p className="mt-2 text-sm text-green-700">
          We&apos;ll review your request and get back to you shortly. Emergencies are
          prioritized immediately; routine requests typically hear back the same business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md space-y-4 text-left">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" className="mt-1 w-full rounded border px-3 py-2" />
        {state.errors.name && <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input id="phone" name="phone" className="mt-1 w-full rounded border px-3 py-2" />
          {state.errors.phone && <p className="mt-1 text-sm text-red-600">{state.errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" className="mt-1 w-full rounded border px-3 py-2" />
          {state.errors.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium">
          Location
        </label>
        <input id="location" name="location" className="mt-1 w-full rounded border px-3 py-2" />
        {state.errors.location && (
          <p className="mt-1 text-sm text-red-600">{state.errors.location}</p>
        )}
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium">
          Service type
        </label>
        <select id="serviceType" name="serviceType" className="mt-1 w-full rounded border px-3 py-2">
          <option value="">Select one</option>
          {clientConfig.serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {state.errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">{state.errors.serviceType}</p>
        )}
      </div>

      <div>
        <label htmlFor="rawInput" className="block text-sm font-medium">
          Describe the issue
        </label>
        <textarea
          id="rawInput"
          name="rawInput"
          rows={4}
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors.rawInput && (
          <p className="mt-1 text-sm text-red-600">{state.errors.rawInput}</p>
        )}
      </div>

      <div>
        <label htmlFor="urgency" className="block text-sm font-medium">
          Urgency
        </label>
        <select id="urgency" name="urgency" className="mt-1 w-full rounded border px-3 py-2">
          <option value="">Select one</option>
          {URGENCY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {state.errors.urgency && (
          <p className="mt-1 text-sm text-red-600">{state.errors.urgency}</p>
        )}
      </div>

      <div>
        <label htmlFor="preferredSchedule" className="block text-sm font-medium">
          Preferred schedule (optional)
        </label>
        <input
          id="preferredSchedule"
          name="preferredSchedule"
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded px-4 py-2 font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: clientConfig.brandColor }}
      >
        {pending ? "Submitting…" : "Request service"}
      </button>
    </form>
  );
}
