import React from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utils/getUserProfile";
import ManualCsvUpload from "@/components/admin/ManualCsvUpload";

export default async function AdminOperationsHub() {
  // Route guard: only administrators can access this page
  const profile = await getUserProfile();
  if (!profile || profile.role !== 'administrator') {
    redirect('/');
  }

  const supabase = await createClient();

  // Fetch Sales Reps and their Departments
  const { data: reps } = await supabase
    .from('sales_reps')
    .select(`
      id,
      name,
      email,
      active_status,
      departments ( name )
    `)
    .order('name');

  // Fetch API Sync Logs
  const { data: syncLogs } = await supabase
    .from('email_sync_logs')
    .select('*')
    .order('received_at', { ascending: false })
    .limit(5);

  // Helper to format date
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const params = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
    return date.toLocaleDateString('en-US', params);
  };

  return (
    <div className="flex flex-col min-w-0 flex-1 -m-6 h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Admin Operations Hub</h2>
          <p className="text-sm text-slate-500">Configure your data pipelines and manage regional sales personnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Discard</button>
          <button className="px-6 py-2 bg-primary text-forest font-bold rounded-lg text-sm shadow-lg shadow-primary/20 hover:brightness-105 transition-all cursor-pointer">Save Changes</button>
        </div>
      </header>
      
      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 px-8 border-b border-slate-200 dark:border-white/10 shrink-0">
        <div className="flex gap-8">
          <button className="border-b-2 border-primary py-4 text-sm font-bold text-slate-900 dark:text-white cursor-pointer">Data Connections</button>
          <button className="border-b-2 border-transparent py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Sales Team</button>
          <button className="border-b-2 border-transparent py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">System Audit</button>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 relative">
        {/* Section: Connection Settings */}
        <section className="max-w-4xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary">settings_input_component</span>
            Email Webhook Configuration
          </h3>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <div className="space-y-2 text-sm text-slate-500">
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Description:</strong> Vetro is configured to receive inbound automated email reports (CSV format) directly into our database.
                </p>
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Provider:</strong> Expected POST webhook format.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Endpoint URL / Webhook</label>
                <div className="relative">
                  <input 
                    className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-100 pr-10 pointer-events-none" 
                    value="https://yourdomain.com/api/webhooks/inbound-email" 
                    type="text" 
                    readOnly 
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
            
            <ManualCsvUpload />
          </div>
        </section>

        {/* Section: Sales Team Roster */}
        <section className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-primary">badge</span>
              Sales Team Roster
            </h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
              <span className="material-symbols-outlined text-sm">add_circle</span> Add Member
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {reps?.map((rep) => (
                  <tr key={rep.id}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs relative shrink-0">
                        {rep.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{rep.name}</span>
                        <span className="text-xs text-slate-500">{rep.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {Array.isArray(rep.departments) ? rep.departments[0]?.name : 
                       // @ts-ignore
                       rep.departments?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      {rep.active_status ? (
                        <span className="px-2 py-1 text-[10px] font-bold bg-primary/20 text-primary rounded-full uppercase">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-full uppercase">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer">more_vert</button>
                    </td>
                  </tr>
                ))}
                
                {!reps || reps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                      No sales representatives found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Email Sync Audit Log */}
        <section className="max-w-4xl pb-12">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Webhook Syncs
          </h3>
          <div className="space-y-3">
            {syncLogs?.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10">
                <div className={`mt-1 size-8 shrink-0 rounded flex items-center justify-center ${
                  log.status === 'success' 
                    ? 'bg-primary/10 text-primary' 
                    : log.status === 'processing'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-red-500/10 text-red-500'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {log.status === 'success' ? 'cloud_done' : log.status === 'processing' ? 'sync' : 'error'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {log.status === 'success' ? 'API Sync Completed' : log.status === 'processing' ? 'Sync In Progress' : 'Sync Failed'}
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                        log.status === 'success' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {log.status}
                      </span>
                    </p>
                    <span className="text-xs text-slate-400">{formatTimeAgo(log.received_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-1">
                    {log.status === 'success' 
                      ? `System successfully fetched and processed ${log.records_processed} payload records.` 
                      : log.error_message || 'An unknown error occurred during sync.'}
                  </p>
                  <p className="text-[10px] text-slate-400">Log ID: {log.id}</p>
                </div>
              </div>
            ))}
            
            {!syncLogs || syncLogs.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10">
                No webhook sync logs found. System is waiting for new inbound emails.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
