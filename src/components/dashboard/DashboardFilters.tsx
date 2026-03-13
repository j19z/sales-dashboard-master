'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDept = searchParams.get('dept') || 'all';
  const currentDays = searchParams.get('days') || '30';

  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Always push to clear any pagination or other state if necessary
    router.push(`/?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-forest p-4 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-slate-400 text-sm">filter_alt</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Filters:</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Department</label>
          <select 
            value={currentDept}
            onChange={(e) => handleFilterChange('dept', e.target.value)}
            className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 focus:ring-primary focus:border-primary text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="all">Total Business</option>
            <option value="Human Health">Human Health</option>
            <option value="Animal Health">Animal Health</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">Timeframe</label>
          <select 
            value={currentDays}
            onChange={(e) => handleFilterChange('days', e.target.value)}
            className="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 focus:ring-primary focus:border-primary text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last 365 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
