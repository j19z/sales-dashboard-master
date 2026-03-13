"use client";

import React, { useState, useMemo, useRef } from "react";

// ────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────
const mockReports = [
  { id: "RPT-001", name: "Q3 Revenue Summary", type: "Revenue", rep: "Alex Rivera", date: "2023-10-01", status: "Completed", calls: 145, conversion: 18.5, revenue: 125400 },
  { id: "RPT-002", name: "Weekly Pipeline Health", type: "Pipeline", rep: "Jordan Smith", date: "2023-10-03", status: "Completed", calls: 120, conversion: 15.2, revenue: 98200 },
  { id: "RPT-003", name: "SDR Call Volume — Sept", type: "Call Activity", rep: "Casey Webb", date: "2023-10-05", status: "In Review", calls: 280, conversion: 8.4, revenue: 45000 },
  { id: "RPT-004", name: "Enterprise Win/Loss Deep Dive", type: "Win/Loss", rep: "Taylor Swift", date: "2023-10-07", status: "Completed", calls: 95, conversion: 21.0, revenue: 110500 },
  { id: "RPT-005", name: "Churn Risk Assessment — Oct", type: "Churn", rep: "Morgan Lee", date: "2023-10-09", status: "Completed", calls: 310, conversion: 6.5, revenue: 38000 },
  { id: "RPT-006", name: "Sentiment Trend Analysis", type: "Sentiment", rep: "Alex Rivera", date: "2023-10-11", status: "Draft", calls: 200, conversion: 17.0, revenue: 89000 },
  { id: "RPT-007", name: "Mid-Market Segment Report", type: "Revenue", rep: "Jordan Smith", date: "2023-10-12", status: "Completed", calls: 88, conversion: 12.4, revenue: 56700 },
  { id: "RPT-008", name: "Inbound Lead Conversion Q3", type: "Pipeline", rep: "Taylor Swift", date: "2023-10-14", status: "In Review", calls: 175, conversion: 19.8, revenue: 134200 },
  { id: "RPT-009", name: "Call Duration Benchmarks", type: "Call Activity", rep: "Casey Webb", date: "2023-10-15", status: "Completed", calls: 390, conversion: 7.1, revenue: 29500 },
  { id: "RPT-010", name: "Q4 Forecast Report", type: "Revenue", rep: "Morgan Lee", date: "2023-10-17", status: "Draft", calls: 60, conversion: 24.0, revenue: 188000 },
  { id: "RPT-011", name: "Competitive Displacement Analysis", type: "Win/Loss", rep: "Alex Rivera", date: "2023-10-18", status: "Completed", calls: 112, conversion: 16.0, revenue: 78900 },
  { id: "RPT-012", name: "Upsell Opportunities Summary", type: "Pipeline", rep: "Taylor Swift", date: "2023-10-20", status: "In Review", calls: 140, conversion: 22.5, revenue: 145000 },
  { id: "RPT-013", name: "NPS Feedback Correlation Report", type: "Sentiment", rep: "Jordan Smith", date: "2023-10-21", status: "Draft", calls: 95, conversion: 14.3, revenue: 62000 },
  { id: "RPT-014", name: "Demo-to-Close Rate Analysis", type: "Win/Loss", rep: "Morgan Lee", date: "2023-10-22", status: "Completed", calls: 220, conversion: 9.8, revenue: 41200 },
  { id: "RPT-015", name: "October Outreach Campaign", type: "Call Activity", rep: "Casey Webb", date: "2023-10-24", status: "In Review", calls: 450, conversion: 5.9, revenue: 22800 },
];

type SortKey = "id" | "name" | "type" | "rep" | "date" | "status" | "calls" | "conversion" | "revenue";
type SortDir = "asc" | "desc";

const REPORT_TYPES = ["All Types", "Revenue", "Pipeline", "Call Activity", "Win/Loss", "Churn", "Sentiment"];
const STATUSES = ["All Statuses", "Completed", "In Review", "Draft"];
const REPS = ["All Reps", "Alex Rivera", "Jordan Smith", "Casey Webb", "Taylor Swift", "Morgan Lee"];

const statusStyle = (status: string) => {
  switch (status) {
    case "Completed": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    case "In Review": return "bg-amber-50 text-amber-600 border border-amber-200";
    case "Draft": return "bg-slate-100 text-slate-500 border border-slate-200";
    default: return "";
  }
};

const exportData = (format: string, data: typeof mockReports) => {
  const headers = ["ID", "Report Name", "Type", "Rep", "Date", "Status", "Calls", "Conversion %", "Revenue"];
  const rows = data.map(r => [r.id, r.name, r.type, r.rep, r.date, r.status, r.calls, r.conversion, r.revenue]);

  let content = "";
  let filename = `vetro_reports_${new Date().toISOString().slice(0, 10)}`;
  let mimeType = "text/plain";

  if (format === "csv" || format === "excel") {
    const sep = ",";
    content = [headers.join(sep), ...rows.map(r => r.join(sep))].join("\n");
    filename += format === "excel" ? ".csv" : ".csv"; // Excel opens .csv natively
    mimeType = "text/csv";
  } else if (format === "txt") {
    const colWidths = [8, 44, 14, 16, 12, 12, 8, 13, 14];
    const pad = (s: string | number, w: number) => String(s).padEnd(w).slice(0, w);
    const line = colWidths.map(w => "─".repeat(w)).join("┼");
    content  = colWidths.map((w, i) => pad(headers[i], w)).join("│") + "\n";
    content += line + "\n";
    content += rows.map(r => colWidths.map((w, i) => pad(r[i], w)).join("│")).join("\n");
    filename += ".txt";
    mimeType = "text/plain";
  } else if (format === "json") {
    content = JSON.stringify(data, null, 2);
    filename += ".json";
    mimeType = "application/json";
  } else if (format === "pdf") {
    alert("PDF export would require a server-side service. For now, use your browser's Print → Save as PDF on this table.");
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [repFilter, setRepFilter] = useState("All Reps");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // ── Sorting handler ──
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // ── Filtered + sorted data ──
  const filtered = useMemo(() => {
    return mockReports
      .filter(r => {
        const q = search.toLowerCase();
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.rep.toLowerCase().includes(q);
        const matchType = typeFilter === "All Types" || r.type === typeFilter;
        const matchStatus = statusFilter === "All Statuses" || r.status === statusFilter;
        const matchRep = repFilter === "All Reps" || r.rep === repFilter;
        const matchFrom = !dateFrom || r.date >= dateFrom;
        const matchTo = !dateTo || r.date <= dateTo;
        return matchSearch && matchType && matchStatus && matchRep && matchFrom && matchTo;
      })
      .sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        const cmp = typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [search, typeFilter, statusFilter, repFilter, dateFrom, dateTo, sortKey, sortDir]);

  // ── Row selection ──
  const allSelected = filtered.length > 0 && filtered.every(r => selectedRows.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map(r => r.id)));
  };
  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const exportRows = selectedRows.size > 0
    ? filtered.filter(r => selectedRows.has(r.id))
    : filtered;

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`material-symbols-outlined text-[14px] ml-0.5 transition-all ${sortKey === col ? "text-primary" : "text-slate-300"}`}>
      {sortKey === col ? (sortDir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
    </span>
  );

  const ThBtn = ({ col, label, right }: { col: SortKey; label: string; right?: boolean }) => (
    <th className={`px-4 py-3 ${right ? "text-right" : ""}`}>
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-primary transition-colors cursor-pointer group"
        style={right ? { marginLeft: "auto" } : {}}
      >
        {label}<SortIcon col={col} />
      </button>
    </th>
  );

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-forest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span>
            Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">Search, filter, and export your sales reports.</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-base">add</span>
            New Report
          </button>
          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Export
              {selectedRows.size > 0 && (
                <span className="bg-white/20 text-white px-1.5 rounded-full text-xs font-bold">{selectedRows.size}</span>
              )}
              <span className="material-symbols-outlined text-base">{exportOpen ? "expand_less" : "expand_more"}</span>
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedRows.size > 0 ? `Export ${selectedRows.size} selected` : `Export all ${filtered.length} rows`}
                  </p>
                </div>
                {[
                  { fmt: "csv",   icon: "table_view",       label: "CSV",          desc: "Spreadsheet-ready" },
                  { fmt: "excel", icon: "grid_on",           label: "Excel (.csv)", desc: "Open in Excel/Sheets" },
                  { fmt: "txt",   icon: "text_snippet",      label: "Plain Text",   desc: "Tab-formatted table" },
                  { fmt: "json",  icon: "data_object",       label: "JSON",         desc: "Raw data format" },
                  { fmt: "pdf",   icon: "picture_as_pdf",    label: "PDF",          desc: "Print-ready document" },
                ].map(({ fmt, icon, label, desc }) => (
                  <button
                    key={fmt}
                    onClick={() => { exportData(fmt, exportRows); setExportOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                      <p className="text-[10px] text-slate-400">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">search</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports by name, ID, or rep..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Type */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">category</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm cursor-pointer appearance-none"
            >
              {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">expand_more</span>
          </div>

          {/* Status */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">radio_button_checked</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm cursor-pointer appearance-none"
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">expand_more</span>
          </div>

          {/* Rep */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">person</span>
            <select
              value={repFilter}
              onChange={e => setRepFilter(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm cursor-pointer appearance-none"
            >
              {REPS.map(r => <option key={r}>{r}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">expand_more</span>
          </div>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm cursor-pointer"
            title="From date"
          />
          <span className="flex items-center text-slate-400 text-sm font-medium">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm cursor-pointer"
            title="To date"
          />

          {/* Clear Filters */}
          {(search || typeFilter !== "All Types" || statusFilter !== "All Statuses" || repFilter !== "All Reps" || dateFrom || dateTo) && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("All Types"); setStatusFilter("All Statuses"); setRepFilter("All Reps"); setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">filter_alt_off</span>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Results info bar ── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold text-forest">{filtered.length}</span> of <span className="font-bold">{mockReports.length}</span> reports
          {selectedRows.size > 0 && <span className="ml-2 text-primary font-semibold">· {selectedRows.size} selected</span>}
        </p>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span className="material-symbols-outlined text-sm">sort</span>
          Sorted by <span className="font-semibold text-slate-600 ml-1 capitalize">{sortKey}</span>
          <span className="material-symbols-outlined text-sm">{sortDir === "asc" ? "arrow_upward" : "arrow_downward"}</span>
        </div>
      </div>

      {/* ── Main Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {/* Checkbox */}
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="size-4 rounded border-slate-300 accent-primary cursor-pointer"
                  />
                </th>
                <ThBtn col="id" label="Report ID" />
                <ThBtn col="name" label="Report Name" />
                <ThBtn col="type" label="Type" />
                <ThBtn col="rep" label="Assigned Rep" />
                <ThBtn col="date" label="Date" />
                <ThBtn col="calls" label="Calls" right />
                <ThBtn col="conversion" label="Win Rate" right />
                <ThBtn col="revenue" label="Revenue" right />
                <ThBtn col="status" label="Status" />
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">manage_search</span>
                    <p className="text-slate-500 font-medium">No reports match your filters.</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search or clearing filters.</p>
                  </td>
                </tr>
              ) : filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`transition-colors group ${selectedRows.has(r.id) ? "bg-primary/5" : idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-primary/5`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                      className="size-4 rounded border-slate-300 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-400">{r.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-forest group-hover:text-primary transition-colors cursor-pointer max-w-[240px] truncate" title={r.name}>
                      {r.name}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {r.rep.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-700">{r.rep}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-700 font-mono text-right">{r.calls.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-sm text-right">
                    <span className={`font-bold ${r.conversion >= 15 ? "text-primary" : r.conversion >= 10 ? "text-amber-500" : "text-red-500"}`}>
                      {r.conversion}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-forest text-right">
                    ${r.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="View" className="p-1 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-md transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                      <button title="Edit" className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button title="Download" className="p-1 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-md transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {selectedRows.size > 0
              ? `${selectedRows.size} row${selectedRows.size > 1 ? "s" : ""} selected — click Export to download selection`
              : "Select rows to export a subset, or export all filtered results"}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-primary hover:border-primary transition-colors cursor-pointer disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="text-xs font-semibold text-slate-600 px-2">Page 1 of 1</span>
            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-primary hover:border-primary transition-colors cursor-pointer disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Click-away to close export dropdown */}
      {exportOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
      )}
    </div>
  );
}
