"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import type { UserRole } from "@/utils/getUserProfile";

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: "dashboard", exact: true },
    { name: "Analytics", href: "/analytics", icon: "bar_chart" },
    { name: "Calls", href: "/calls", icon: "call", startsWith: true },
    { name: "Reports", href: "/reports", icon: "description" },
    { name: "AI Chat", href: "/ai-chat", icon: "psychology" },
    { name: "Team", href: "/team", icon: "groups" },
    ...(userRole === 'administrator'
      ? [{ name: "Admin Hub", href: "/admin", icon: "admin_panel_settings" }]
      : []),
  ];

  return (
    <nav className="w-64 bg-forest flex flex-col py-6 border-r border-forest shadow-2xl z-20 shrink-0">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Vetro</h1>
      </div>
      
      <div className="flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : item.startsWith 
              ? pathname.startsWith(item.href)
              : pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.name === "Calls" ? "/calls/12940" : item.href}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(0,199,90,0.3)]"
                  : "text-emerald-100/40 hover:text-primary hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined shrink-0">{item.icon}</span>
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 px-3">
        <Link
          href="/settings"
          className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
            pathname === "/settings"
              ? "bg-primary text-white shadow-[0_0_15px_rgba(0,199,90,0.3)]"
              : "text-emerald-100/40 hover:text-primary hover:bg-white/5"
          }`}
        >
          <span className="material-symbols-outlined shrink-0">settings</span>
          <span className="text-sm font-semibold">Settings</span>
        </Link>
        
        <form action={logout}>
          <button
            type="submit"
            className="group flex items-center gap-3 p-3 w-full text-emerald-100/40 hover:text-red-400 transition-colors hover:bg-white/5 rounded-xl cursor-pointer"
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </form>
        
        <div className="px-3 py-2">
          <div className="w-full h-[1px] bg-emerald-100/20"></div>
        </div>
        
        <button className="flex items-center gap-3 p-3 w-full rounded-xl bg-gradient-to-br from-primary to-emerald-700 hover:scale-[1.02] transition-transform active:scale-95 text-white cursor-pointer">
          <div className="size-6 bg-forest rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-sm">bolt</span>
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Upgrade Pro</span>
        </button>
      </div>
    </nav>
  );
}

