"use client";

import { useEffect, useState } from "react";

type PackageId = "snapshot" | "core" | "methylation-plus" | "elite";

type StoredReport = {
  id: string;
  createdAt: string;
  packageId: PackageId;
  tierLabel: string;
  fileName: string;
  report: string;
};

const LOCAL_STORAGE_KEY = "stratahelix_reports_v1";

export default function ReportsPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredReport[];
      setReports(parsed);
    } catch (err) {
      console.error("Failed to load reports from localStorage:", err);
    }
  }, []);

  function handleClearAll() {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      setReports([]);
      setSelectedId(null);
    } catch (err) {
      console.error("Failed to clear reports:", err);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          My StrataHelix reports
        </h1>
        <p className="text-sm text-[#9CA3AF] max-w-2xl">
          These are reports generated on this device. They’re stored locally in your
          browser using encrypted-like local storage (no sync yet). Clearing your
          browser storage or switching devices will remove this history.
        </p>
      </header>

      <section className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-[#6B7280]">
          {reports.length === 0
            ? "No reports saved yet. Generate a Snapshot or paid report to see it here."
            : `Showing ${reports.length} report${
                reports.length === 1 ? "" : "s"
              } saved on this device.`}
        </p>
        {reports.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center rounded-md border border-[#374151] px-3 py-1.5 text-[11px] font-medium text-[#F9FAFB] hover:border-[#EF4444]/80 hover:text-[#FEE2E2] transition"
          >
            Clear all
          </button>
        )}
      </section>

      <section className="space-y-3">
        {reports.length === 0 && (
          <div className="rounded-xl border border-[#1F2933] bg-[#020617] p-6 text-sm text-[#9CA3AF]">
            Generate a Snapshot report from the upload page, or complete a paid tier
            flow, then upload your DNA. New reports will appear here automatically.
          </div>
        )}

        {reports.map((r) => {
          const isSelected = r.id === selectedId;
          const date = new Date(r.createdAt);
          const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

          return (
            <div
              key={r.id}
              className="rounded-xl border border-[#1F2933] bg-[#020617] p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#F9FAFB]">
                    {r.tierLabel}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    File: <span className="font-medium">{r.fileName}</span>
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Generated: {formattedDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId((prev) => (prev === r.id ? null : r.id))
                  }
                  className="inline-flex items-center rounded-md border border-[#374151] px-3 py-1.5 text-[11px] font-medium text-[#F9FAFB] hover:border-[#27E0C0]/80 transition"
                >
                  {isSelected ? "Hide report" : "View report"}
                </button>
              </div>

              {isSelected && (
                <div className="mt-3 max-h-[400px] overflow-auto rounded-lg bg-black/40 p-3 text-xs whitespace-pre-wrap text-[#E5E7EB]">
                  {r.report}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
