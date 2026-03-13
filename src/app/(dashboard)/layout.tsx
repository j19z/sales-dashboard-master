import React from "react";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";
import { getUserProfile, getRoleLabel } from "@/utils/getUserProfile";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  const displayName = profile?.full_name || 'User';
  const displayRole = profile ? getRoleLabel(profile.role) : 'Sales Supervisor';
  const userRole = profile?.role || 'sales_supervisor';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      {/* Sidebar Navigation */}
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-forest/30 bg-white dark:bg-forest flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-background-dark/50 rounded-lg px-3 py-1.5 w-80">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2" placeholder="Search commands or data..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-background-dark/50 hover:bg-slate-200 dark:hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium cursor-pointer">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <span>Oct 24, 2023</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-forest/50 mx-2"></div>
            <button className="relative p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 size-2 bg-primary rounded-full border-2 border-white dark:border-forest"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-forest/50">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-forest dark:text-slate-100">{displayName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{displayRole}</p>
              </div>
              <div className="size-9 rounded-full bg-primary/20 border-2 border-primary overflow-hidden relative flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{initials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}

