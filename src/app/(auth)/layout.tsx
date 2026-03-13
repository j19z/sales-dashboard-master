import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background-light dark:bg-background-dark font-display">
      {/* Left Side: Workflow & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#052e16] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-16">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">database</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Vetro</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Master your sales pipeline with AI intelligence.
            </h2>
            <p className="text-primary/80 text-lg mb-12">
              Automate data ingestion, process insights, and execute winning strategies in real-time.
            </p>
            {/* Workflow Chart */}
            <div className="space-y-0">
              {/* Step 1 */}
              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">input</span>
                  </div>
                  <div className="w-px h-16 bg-primary/20"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-lg">Ingest</h3>
                  <p className="text-slate-400 text-sm">Automated data collection from 50+ sources.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">settings_suggest</span>
                  </div>
                  <div className="w-px h-16 bg-primary/20"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-lg">Process</h3>
                  <p className="text-slate-400 text-sm">Real-time AI data cleaning and transformation.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">insights</span>
                  </div>
                  <div className="w-px h-16 bg-primary/20"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-lg">Analyze</h3>
                  <p className="text-slate-400 text-sm">Predictive modeling and insight generation.</p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-semibold text-lg">Execute</h3>
                  <p className="text-slate-400 text-sm">Actionable sales triggers and closed deals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-slate-400 text-sm">
          © {new Date().getFullYear()} Vetro AI Technologies. All rights reserved.
        </div>
      </div>
      
      {/* Right Side: Form (Injected via children) */}
      <div className="flex-1 flex flex-col justify-center bg-white dark:bg-background-dark px-6 py-12 lg:px-24">
        {children}
      </div>
    </div>
  );
}
