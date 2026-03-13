import React from "react";
import Link from "next/link";

export default function CallDeepDivePage({ params }: { params: { id: string } }) {
  // Use params.id if needed, currently hardcoded to 12940 for realism
  const callId = params.id || "12940";

  return (
    <div className="flex flex-col min-w-0 flex-1 -m-6 h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="h-20 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link className="hover:text-primary" href="/calls">Back to Calls</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">Call #{callId}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-bold">Call Deep Dive</h2>
            <span className="text-sm text-slate-400 font-normal">
              Oct 24, 2023 - 10:30 AM | Sales Rep: <span className="text-primary font-medium">John Doe</span>
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">share</span>
            Share Analysis
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-forest rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        {/* Center: Audio & Transcript */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Audio Player Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button className="size-12 rounded-full bg-primary flex items-center justify-center text-forest shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[32px] font-variation-fill">play_arrow</span>
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Sarah Chen Intro</span>
                  <span className="text-xs text-slate-500">01:12 / 04:35</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold rounded bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white">1x</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors">1.5x</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors">2x</button>
              </div>
            </div>
            <div className="relative h-16 w-full flex items-center gap-0.5">
              {/* Simple SVG Waveform Placeholder */}
              <div className="flex-1 h-full flex items-center gap-[2px]">
                <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-6 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-8 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-12 w-1 bg-primary rounded-full"></div>
                <div className="h-10 w-1 bg-primary rounded-full"></div>
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <div className="h-14 w-1 bg-primary rounded-full"></div>
                <div className="h-6 w-1 bg-primary rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-8 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-6 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-14 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-8 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-12 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-6 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-6 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-12 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-8 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-14 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-4 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-8 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-6 w-1 bg-primary/30 rounded-full"></div>
                <div className="h-10 w-1 bg-primary/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Transcript Window */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transcript</h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white">Original Audio</button>
                <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">AI Translation</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Message Bubble John */}
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">JD</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">John Doe</span>
                    <span className="text-[10px] text-slate-400">10:31 AM</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hi Sarah, thanks for hopping on today. I wanted to follow up on our last conversation regarding the <span className="bg-primary/20 border-b border-primary px-1">enterprise licensing model</span> we discussed.
                  </p>
                </div>
              </div>
              
              {/* Message Bubble Sarah */}
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-forest dark:text-primary">SC</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Sarah Chen</span>
                    <span className="text-[10px] text-slate-400">10:32 AM</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Absolutely, John. We reviewed the numbers internally and we&apos;re definitely interested. We are specifically looking for <span className="bg-primary/20 border-b border-primary px-1 font-medium">automated compliance reporting</span> to be included in the tier.
                  </p>
                </div>
              </div>
              
              {/* Message Bubble John */}
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">JD</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">John Doe</span>
                    <span className="text-[10px] text-slate-400">10:33 AM</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    That&apos;s standard in our Enterprise Plus plan. I can send over the <span className="bg-primary/20 border-b border-primary px-1 font-medium">updated pricing deck</span> this afternoon to reflect those specific requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Extraction */}
        <aside className="w-80 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
          {/* Conversion Probability */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Conversion Probability</h3>
            <div className="flex flex-col items-center">
              <div className="relative size-32 flex items-center justify-center">
                {/* Background circle */}
                <svg className="size-full -rotate-90" viewBox="0 0 128 128">
                  <circle className="text-slate-100 dark:text-slate-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                  {/* Progress circle */}
                  <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="54.6" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">85%</span>
                  <span className="text-[10px] font-bold text-primary">HIGH</span>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">Sarah showed high intent during the feature discussion phase.</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Summary</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Sarah Chen (Decision Maker) expressed strong interest in the Enterprise Plus tier, specifically for automated compliance features. The discussion moved from initial discovery to specific technical requirements. John successfully positioned the value proposition, leading to a request for pricing.
            </p>
          </div>

          {/* Action Items */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Action Items</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 size-5 border-2 border-primary rounded flex items-center justify-center shrink-0 bg-primary/10 dark:bg-transparent">
                  <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Send updated pricing deck</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 size-5 border-2 border-slate-300 dark:border-slate-600 rounded shrink-0"></div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Schedule technical demo for compliance team</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 size-5 border-2 border-slate-300 dark:border-slate-600 rounded shrink-0"></div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">Share case study on compliance automation</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <div className="mt-0.5 size-5 border-2 border-primary bg-primary rounded flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-forest font-bold">check</span>
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium line-through">Confirm meeting attendees</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
