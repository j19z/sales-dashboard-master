"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Mock Data for Charts
const revenueData = [
  { month: "Jan", revenue: 45000, target: 40000 },
  { month: "Feb", revenue: 52000, target: 45000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 59000, target: 60000 },
  { month: "Jun", revenue: 75000, target: 65000 },
  { month: "Jul", revenue: 82000, target: 70000 },
];

const sentimentData = [
  { name: "Positive", value: 65, color: "#00c75a" }, // Primary green
  { name: "Neutral", value: 25, color: "#e2e8f0" },  // Slate 200 light mode friendly, maybe use an array of colors depending on theme later, but for pie chart these are ok
  { name: "Negative", value: 10, color: "#ef4444" }, // Red 500
];
const pieColors = ["#00c75a", "#94a3b8", "#ef4444"];

const repPerformance = [
  { id: 1, name: "Alex Rivera", role: "Sr. Account Exec", calls: 145, conversion: "18.5%", revenue: "$125,400", trend: "+12%", sentiment: "Positive" },
  { id: 2, name: "Jordan Smith", role: "Account Exec", calls: 120, conversion: "15.2%", revenue: "$98,200", trend: "+5%", sentiment: "Positive" },
  { id: 3, name: "Casey Webb", role: "SDR", calls: 280, conversion: "8.4%", revenue: "$45,000", trend: "-2%", sentiment: "Negative" },
  { id: 4, name: "Taylor Swift", role: "Account Exec", calls: 95, conversion: "21.0%", revenue: "$110,500", trend: "+18%", sentiment: "Positive" },
  { id: 5, name: "Morgan Lee", role: "SDR", calls: 310, conversion: "6.5%", revenue: "$38,000", trend: "+1%", sentiment: "Neutral" },
];

// Helper for sentiment styling in table
const getSentimentStyle = (sentiment: string) => {
  switch (sentiment?.toUpperCase()) {
    case "POSITIVE":
      return "bg-primary/10 text-primary border border-primary/20";
    case "NEGATIVE":
      return "bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20";
    case "NEUTRAL":
    default:
      return "bg-slate-100 dark:bg-background-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-forest/50";
  }
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7D");

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bar_chart</span>
            Analytics Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your team&apos;s performance and revenue metrics.
          </p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex items-center bg-white dark:bg-forest p-1 rounded-lg border border-slate-200 dark:border-forest/50 shadow-sm self-start">
          {["24H", "7D", "30D", "YTD", "ALL"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                timeRange === range
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:text-forest dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Total Revenue</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md">payments</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">$428,500</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>+15.3%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Compared to last period</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Avg Conversion</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md">donut_large</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">14.2%</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>+2.1%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Across 85 total active deals</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Avg Call Duration</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md">timer</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">04:32</h3>
            <span className="text-red-500 text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_down</span>-0:45
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Shorter, more effective calls</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">Deal Velocity</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md">speed</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-forest dark:text-white">18 Days</h3>
            <span className="text-primary text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-xs">trending_down</span>-2 Days
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Average time to close won</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-forest dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">monitoring</span>
                Revenue Trend
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monthly actual vs target revenue</p>
            </div>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-background-dark rounded-md transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-sm">more_vert</span>
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c75a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00c75a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f2318', borderColor: '#052e16', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#00c75a' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Actual Revenue" 
                  stroke="#00c75a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Revenue" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Call Sentiment Pie Chart */}
        <div className="bg-white dark:bg-forest p-5 rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="font-bold text-forest dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">pie_chart</span>
                Call Sentiment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on AI analysis of 950 calls</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f2318', borderColor: '#052e16', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-forest dark:text-white">65%</span>
              <span className="text-xs text-primary font-bold">Positive</span>
            </div>
          </div>
          {/* Custom Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {sentimentData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: pieColors[index] }}></div>
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Leaderboard and Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Leaderboard Table */}
        <div className="xl:col-span-2 bg-white dark:bg-forest rounded-xl border border-slate-200 dark:border-forest/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-forest/50 flex items-center justify-between bg-white dark:bg-forest">
            <h2 className="font-bold text-forest dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">groups_3</span>
              Sales Rep Performance
            </h2>
            <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-background-dark/30 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Rep / Role</th>
                  <th className="px-6 py-4 text-center">Calls Made</th>
                  <th className="px-6 py-4 text-center">Win Rate</th>
                  <th className="px-6 py-4 text-right">Revenue Generated</th>
                  <th className="px-6 py-4 text-center">Avg Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-forest/30">
                {repPerformance.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 relative overflow-hidden">
                        {rep.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-forest dark:text-slate-200 group-hover:text-primary transition-colors cursor-pointer">
                          {rep.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{rep.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-mono text-slate-600 dark:text-slate-300">
                      {rep.calls}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-sm font-bold text-forest dark:text-white">{rep.conversion}</span>
                        {rep.trend.startsWith('+') ? (
                          <span className="material-symbols-outlined text-[10px] text-primary">north_east</span>
                        ) : (
                          <span className="material-symbols-outlined text-[10px] text-red-500">south_east</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-forest dark:text-white">
                      {rep.revenue}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSentimentStyle(rep.sentiment)}`}>
                        {rep.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Actionable Insights */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-background-dark rounded-xl border border-primary/20 shadow-sm flex flex-col">
          <div className="p-5 border-b border-primary/20 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Vetro AI Insights
            </h2>
          </div>
          <div className="p-5 space-y-4 flex-1">
            <div className="bg-white dark:bg-forest/80 p-4 rounded-lg border border-primary/10 shadow-sm flex gap-3 items-start">
              <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
              <div>
                <h4 className="text-sm font-bold text-forest dark:text-white">Upsell Opportunity</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Call phrasing suggests 3 leads currently in "Negotiation" phase could be pitched the Enterprise tier based on compliance keywords mentioned.
                </p>
                <button className="text-xs font-bold text-primary mt-2 hover:underline">View Leads →</button>
              </div>
            </div>

            <div className="bg-white dark:bg-forest/80 p-4 rounded-lg border border-red-500/10 shadow-sm flex gap-3 items-start">
              <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
              <div>
                <h4 className="text-sm font-bold text-forest dark:text-white">Churn Risk Alert</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Negative sentiment detected in Casey Webb's recent calls regarding "pricing updates". Consider scheduling review sessions.
                </p>
                <button className="text-xs font-bold text-red-500 mt-2 hover:underline">Review Calls →</button>
              </div>
            </div>

            <div className="bg-white dark:bg-forest/80 p-4 rounded-lg border border-slate-200 dark:border-forest/50 shadow-sm flex gap-3 items-start">
              <span className="material-symbols-outlined text-amber-500 mt-0.5">trending_up</span>
              <div>
                <h4 className="text-sm font-bold text-forest dark:text-white">Performance Insight</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Taylor Swift's win rate has increased by 18% this month, correlating with a new trial-close technique.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-primary/20 text-center">
             <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-lg">chat</span>
               Ask AI Assistant
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
