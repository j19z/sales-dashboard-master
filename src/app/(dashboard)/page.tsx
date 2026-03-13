import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import DashboardFilters from "@/components/dashboard/DashboardFilters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ dept?: string; days?: string }>;
}) {
  const supabase = await createClient();
  const { dept, days } = await searchParams;

  const activeDept = dept && dept !== 'all' ? dept : null;
  const activeDays = days && days !== 'all' ? parseInt(days, 10) : null;

  // Base query for Recent Calls
  let recentCallsQuery = supabase
    .from('sales_calls')
    .select(`
      id,
      duration,
      call_date,
      sales_reps!inner ( 
        name,
        departments!inner ( name )
      ),
      call_insights ( sentiment_tag )
    `)
    .order('call_date', { ascending: false })
    .limit(5);

  // Base query for Total Calls KPI
  let totalCallsQuery = supabase
    .from('sales_calls')
    .select(`id, sales_reps!inner(departments!inner(name))`, { count: 'exact', head: true });

  // Apply filters to calls
  if (activeDept) {
    recentCallsQuery = recentCallsQuery.eq('sales_reps.departments.name', activeDept);
    totalCallsQuery = totalCallsQuery.eq('sales_reps.departments.name', activeDept);
  }

  if (activeDays) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - activeDays);
    const isoDate = dateLimit.toISOString();
    
    recentCallsQuery = recentCallsQuery.gte('call_date', isoDate);
    totalCallsQuery = totalCallsQuery.gte('call_date', isoDate);
  }

  const { data: recentCalls } = await recentCallsQuery;
  const { count: totalCalls } = await totalCallsQuery;

  // KPIs for Active Reps (filter by department if selected)
  let activeRepsQuery = supabase
    .from('sales_reps')
    .select('*, departments!inner(name)', { count: 'exact', head: true })
    .eq('active_status', true);

  if (activeDept) {
    activeRepsQuery = activeRepsQuery.eq('departments.name', activeDept);
  }

  const { count: activeReps } = await activeRepsQuery;

  // Helper to format duration (seconds -> mm:ss)
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper to format date/time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper for sentiment styling
  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE':
        return "bg-primary/10 text-primary border border-primary/20";
      case 'NEGATIVE':
        return "bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20";
      case 'NEUTRAL':
      default:
        return "bg-slate-100 dark:bg-background-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-forest/50";
    }
  };

  return (
    <>
      {/* 
        This div wraps the entire dashboard content and acts as a boundary 
        with search bar layout if needed, though layout.tsx handles the visual sidebar. 
      */}
      <div className="flex flex-col gap-2 relative">
        <DashboardFilters />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Total Revenue</p>
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">$428,500</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>+8.2%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Sales Perf.</p>
            <span className="material-symbols-outlined text-primary">speed</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">12.5%</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>+5.1%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/2 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Total Calls</p>
            <span className="material-symbols-outlined text-primary">call</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">{totalCalls?.toLocaleString() || '0'}</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>Latest
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Active Reps</p>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">{activeReps?.toLocaleString() || '0'}</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">groups</span>Team
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-background-dark rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Calls Data Table */}
        <div className="xl:col-span-2 bg-white dark:bg-forest rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-forest/50 flex items-center justify-between bg-white dark:bg-forest">
            <h2 className="font-bold text-forest dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Call Activity
            </h2>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-background-dark rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">filter_list</span>
              </button>
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-background-dark rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">more_vert</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-background-dark/30 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <tr>
                  <th className="px-6 py-3">Rep Name</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Sentiment</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-forest/30">
                {recentCalls?.map((call) => {
                  const repData = Array.isArray(call.sales_reps) ? call.sales_reps[0] : call.sales_reps;
                  const repName = (repData as any)?.name || 'Unknown Rep';
                  
                  return (
                    <tr key={call.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 relative">
                          {repName.substring(0,2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-forest dark:text-slate-200 group-hover:text-primary transition-colors cursor-pointer">
                          {repName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {formatDuration(call.duration)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(call.call_date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          getSentimentStyle(
                            Array.isArray(call.call_insights) 
                              ? call.call_insights[0]?.sentiment_tag 
                              // @ts-ignore
                              : call.call_insights?.sentiment_tag
                          )
                        }`}>
                          {Array.isArray(call.call_insights) 
                            ? call.call_insights[0]?.sentiment_tag || 'UNKNOWN' 
                            // @ts-ignore
                            : call.call_insights?.sentiment_tag || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/calls/${call.id}`} className="text-primary hover:text-primary/80 font-bold text-xs uppercase tracking-wider cursor-pointer">Review</Link>
                      </td>
                    </tr>
                  )
                })}
                
                {!recentCalls || recentCalls.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      No recent calls found for these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-auto p-4 border-t border-slate-100 dark:border-forest/50 bg-slate-50/30 dark:bg-background-dark/20 text-center">
            <Link href="/calls" className="text-sm font-semibold text-forest dark:text-slate-300 hover:text-primary transition-colors flex items-center justify-center gap-2 w-full cursor-pointer">
              View Detailed History
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Vector AI Agent Chat */}
        <div className="bg-white dark:bg-forest rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm flex flex-col h-[500px] xl:h-auto">
          <div className="p-5 border-b border-slate-100 dark:border-forest/50 flex items-center justify-between">
            <h2 className="font-bold text-forest dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              Vector AI Agent
            </h2>
            <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary rounded-full">
              <span className="size-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase">Online</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <div className="flex flex-col gap-1">
              <div className="bg-slate-100 dark:bg-background-dark/50 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                <p className="text-sm text-forest dark:text-slate-200">
                  Hello Sales Team! I&apos;ve indexed all calls from the last 24 hours. What would you like to analyze?
                </p>
              </div>
              <span className="text-[10px] text-slate-400 ml-1">Vetro AI • Just now</span>
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Suggested Prompts</p>
              <button className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-forest/50 text-xs text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary dark:hover:border-primary transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-sm">query_stats</span>
                Analyze yesterday&apos;s top calls
              </button>
              <button className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-forest/50 text-xs text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary dark:hover:border-primary transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-sm">sentiment_satisfied</span>
                What&apos;s the sentiment trend?
              </button>
              <button className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-forest/50 text-xs text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary dark:hover:border-primary transition-all flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-sm">assignment_late</span>
                Highlight potential churn risks
              </button>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-forest/50">
            <div className="relative flex items-center bg-slate-50 dark:bg-background-dark rounded-xl px-4 py-2 border border-slate-200 dark:border-forest/50">
              <input className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-400 text-forest dark:text-white" placeholder="Ask anything about sales data..." type="text" />
              <button className="size-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
