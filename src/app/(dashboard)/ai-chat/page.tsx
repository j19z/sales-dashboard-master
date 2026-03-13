"use client";

import React, { useState, useRef, useEffect } from "react";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
  repFilter: string;
  topicFilter: string;
}

// ────────────────────────────────────────────
// Mock Reps & Filters
// ────────────────────────────────────────────
const REPS = [
  "All Reps",
  "Alex Rivera",
  "Jordan Smith",
  "Casey Webb",
  "Taylor Swift",
  "Morgan Lee",
];

const TOPICS = [
  "All Topics",
  "Objection Handling",
  "Pricing Discussions",
  "Competitor Mentions",
  "Follow-up Strategy",
  "Product Features",
  "Closing Techniques",
];

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last quarter", "All time"];

// ────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────
const makeId = () => Math.random().toString(36).slice(2, 10);

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Alex's Q3 Win Patterns",
    preview: "What objection-handling techniques did Alex Rivera use most...",
    date: "Today",
    repFilter: "Alex Rivera",
    topicFilter: "Objection Handling",
    messages: [
      {
        id: makeId(), role: "user", content: "What objection-handling techniques did Alex Rivera use most frequently in Q3 calls that led to a closed deal?",
        timestamp: new Date("2023-10-24T10:15:00"),
      },
      {
        id: makeId(), role: "assistant",
        content: `Based on analyzing **42 closed-won calls** from Alex Rivera in Q3, here are the top objection-handling patterns:\n\n**1. Cost Justification Framework** (used in 28 calls)\nAlex consistently reframed pricing objections by breaking down ROI per-seat. Example from call #CR-4421:\n> *"If each rep saves 2 hours per week, at your average loaded cost that's $18,000/year in recovered productivity — 3x the license fee."*\n\n**2. Competitor Comparison Redirect** (used in 19 calls)\nWhen prospects mentioned competitor solutions, Alex pivoted to integration depth rather than feature-by-feature comparison.\n\n**3. Timeline Pressure via Social Proof** (used in 15 calls)\nReferenced similar companies' implementation timelines to create urgency without being aggressive.\n\n📊 **Win rate when using technique #1:** 67%\n📊 **Average deal size with these patterns:** $14,200`,
        timestamp: new Date("2023-10-24T10:15:12"),
        sources: ["CR-4421", "CR-4398", "CR-4456", "CR-4510"],
      },
      {
        id: makeId(), role: "user", content: "Interesting. How does that compare to Jordan Smith's approach?",
        timestamp: new Date("2023-10-24T10:16:30"),
      },
      {
        id: makeId(), role: "assistant",
        content: `Great question. Comparing Alex Rivera vs Jordan Smith on objection handling:\n\n| Metric | Alex Rivera | Jordan Smith |\n|--------|------------|-------------|\n| Closed-Won Calls (Q3) | 42 | 31 |\n| Primary Technique | Cost Justification | Empathy-first Reframe |\n| Avg Deal Size | $14,200 | $11,800 |\n| Win Rate w/ Technique | 67% | 58% |\n\nJordan tends to use an **empathy-first reframe** — acknowledging the objection genuinely before redirecting. This builds stronger trust but has a longer conversion cycle (avg 22 days vs Alex's 17 days).\n\n💡 **Insight:** Coaching Jordan on Alex's cost justification framework could potentially increase Jordan's win rate by ~9%.`,
        timestamp: new Date("2023-10-24T10:16:45"),
        sources: ["CR-3887", "CR-3912", "CR-3945"],
      },
    ],
  },
  {
    id: "conv-2",
    title: "Casey's Churn Risk Signals",
    preview: "Show me calls from Casey Webb where churn signals were detected...",
    date: "Yesterday",
    repFilter: "Casey Webb",
    topicFilter: "Pricing Discussions",
    messages: [
      {
        id: makeId(), role: "user", content: "Show me calls from Casey Webb where churn signals were detected in the last 30 days.",
        timestamp: new Date("2023-10-23T14:00:00"),
      },
      {
        id: makeId(), role: "assistant",
        content: `I found **7 calls** from Casey Webb with detected churn indicators in the last 30 days:\n\n🔴 **High Risk (3 calls)**\n- **CR-5012** (Oct 18) — Client mentioned "evaluating alternatives" and asked about contract termination\n- **CR-4998** (Oct 15) — Repeated mentions of "budget cuts" and "scaling down"\n- **CR-4967** (Oct 10) — Client expressed frustration with onboarding timeline\n\n🟡 **Medium Risk (4 calls)**\n- **CR-5001** (Oct 16) — Pricing concerns, but still engaged on roadmap\n- **CR-4980** (Oct 12) — Asked about downgrade options\n- **CR-4955** (Oct 8) — Delayed follow-up, low engagement score\n- **CR-4940** (Oct 5) — Competitor mentioned in passing\n\n⚠️ **Recommendation:** Schedule a 1:1 with Casey to review the 3 high-risk accounts. The "evaluating alternatives" language in CR-5012 matches a pattern that preceded 4 churns in Q2.`,
        timestamp: new Date("2023-10-23T14:00:15"),
        sources: ["CR-5012", "CR-4998", "CR-4967", "CR-5001", "CR-4980"],
      },
    ],
  },
  {
    id: "conv-3",
    title: "Team Sentiment Trends",
    preview: "What's the overall sentiment trend across all reps...",
    date: "Oct 21",
    repFilter: "All Reps",
    topicFilter: "All Topics",
    messages: [
      {
        id: makeId(), role: "user", content: "What's the overall sentiment trend across all reps for the past month?",
        timestamp: new Date("2023-10-21T09:30:00"),
      },
      {
        id: makeId(), role: "assistant",
        content: `Here's the team-wide sentiment analysis for October 1-21:\n\n**Overall Sentiment Distribution:**\n- ✅ Positive: 64% (+3% from September)\n- ⚖️ Neutral: 24% (-1%)\n- ❌ Negative: 12% (-2%)\n\n**Per-Rep Breakdown:**\n| Rep | Positive | Neutral | Negative | Trend |\n|-----|----------|---------|----------|-------|\n| Alex Rivera | 78% | 15% | 7% | ↑ +5% |\n| Taylor Swift | 72% | 20% | 8% | ↑ +8% |\n| Jordan Smith | 65% | 25% | 10% | → Flat |\n| Morgan Lee | 55% | 30% | 15% | ↓ -3% |\n| Casey Webb | 48% | 28% | 24% | ↓ -7% |\n\n📉 **Alert:** Casey Webb's negative sentiment has increased significantly. The primary driver is pricing-related pushback in enterprise calls.\n\n📈 **Bright Spot:** Taylor Swift's sentiment improved the most (+8%), correlating with their adoption of a new trial-close technique.`,
        timestamp: new Date("2023-10-21T09:30:18"),
        sources: ["Analytics Pipeline", "Sentiment Model v3.2"],
      },
    ],
  },
  {
    id: "conv-4",
    title: "Morgan's Pipeline Analysis",
    preview: "How is Morgan Lee's pipeline looking for Q4...",
    date: "Oct 19",
    repFilter: "Morgan Lee",
    topicFilter: "Follow-up Strategy",
    messages: [
      {
        id: makeId(), role: "user", content: "How is Morgan Lee's pipeline looking for Q4? Are there any deals at risk?",
        timestamp: new Date("2023-10-19T16:00:00"),
      },
      {
        id: makeId(), role: "assistant",
        content: `Morgan Lee's Q4 pipeline summary:\n\n**Pipeline Value:** $142,000 across 18 active opportunities\n\n**Stage Breakdown:**\n- 🟢 Negotiation (3 deals, $68,000) — Strong signals\n- 🟡 Proposal Sent (5 deals, $45,000) — Awaiting response\n- 🔴 Discovery (10 deals, $29,000) — Early stage, high drop-off risk\n\n**At-Risk Deals:**\n1. **TechFlow Inc.** ($22,000) — No engagement in 12 days, competitor mentioned in last call\n2. **DataSync Corp** ($15,000) — Budget holder changed, new stakeholder hasn't been engaged\n\n💡 **Recommendation:** Morgan should prioritize re-engaging TechFlow Inc. this week. Based on similar deals, accounts that go silent for 14+ days have a 73% probability of going cold.`,
        timestamp: new Date("2023-10-19T16:00:20"),
        sources: ["CRM Pipeline", "CR-4890", "CR-4856"],
      },
    ],
  },
];

// ────────────────────────────────────────────
// Markdown-light renderer (bold, bullet, code, tables, blockquotes)
// ────────────────────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableKey = 0;

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headers = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`tbl-${tableKey++}`} className="overflow-x-auto my-3 rounded-lg border border-slate-200">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>{headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-bold text-slate-600 whitespace-nowrap">{h.trim()}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {body.map((row, ri) => (
              <tr key={ri} className="hover:bg-slate-50/50">
                {row.map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-slate-700 whitespace-nowrap">{formatInline(cell.trim())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  const formatInline = (s: string): React.ReactNode => {
    // Bold **text** and emoji
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={i} className="font-bold text-forest">{p.slice(2, -2)}</strong>;
      return p;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table line
    if (line.trim().startsWith("|")) {
      inTable = true;
      const cells = line.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (!line.trim()) { elements.push(<div key={i} className="h-2" />); continue; }

    // Blockquote
    if (line.trim().startsWith(">")) {
      elements.push(
        <blockquote key={i} className="border-l-3 border-primary/40 pl-3 my-1 text-slate-600 italic text-sm">
          {formatInline(line.replace(/^>\s*/, ""))}
        </blockquote>
      );
      continue;
    }

    // Bullet
    if (line.trim().startsWith("- ")) {
      elements.push(
        <div key={i} className="flex gap-2 pl-1 my-0.5">
          <span className="text-primary mt-0.5 shrink-0">•</span>
          <span>{formatInline(line.replace(/^-\s+/, "").trim())}</span>
        </div>
      );
      continue;
    }

    // Regular text
    elements.push(<p key={i} className="my-0.5">{formatInline(line)}</p>);
  }
  if (inTable) flushTable();

  return <>{elements}</>;
}

// ────────────────────────────────────────────
// Mock streamed response generation
// ────────────────────────────────────────────
const mockResponses: Record<string, string> = {
  default: `I've searched the vector database across all indexed sales calls. Here's what I found based on your query:\n\n**Key Findings:**\n- Analyzed 950+ call transcripts from the current quarter\n- Cross-referenced with CRM deal outcomes and pipeline data\n- Applied sentiment and topic classification models\n\n💡 Could you be more specific about which rep or time period you'd like me to focus on? I can drill deeper into:\n- Individual rep performance patterns\n- Specific objection types\n- Deal stage conversion rates\n- Competitor mention frequency`,
};

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────
export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>(mockConversations[0].id);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchConv, setSearchConv] = useState("");

  // Filters
  const [repFilter, setRepFilter] = useState("All Reps");
  const [topicFilter, setTopicFilter] = useState("All Topics");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [showFilters, setShowFilters] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const filteredConversations = conversations.filter(c => {
    const matchSearch = !searchConv || c.title.toLowerCase().includes(searchConv.toLowerCase()) || c.preview.toLowerCase().includes(searchConv.toLowerCase());
    return matchSearch;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length, isStreaming]);

  // Simulate sending a message
  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { id: makeId(), role: "user", content: input.trim(), timestamp: new Date() };

    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c));
    setInput("");
    setIsStreaming(true);

    // Simulate streamed response after a delay
    setTimeout(() => {
      const repContext = repFilter !== "All Reps" ? `Focusing on **${repFilter}**'s data:\n\n` : "";
      const aiMsg: Message = {
        id: makeId(),
        role: "assistant",
        content: repContext + mockResponses.default,
        timestamp: new Date(),
        sources: ["Vector DB", "CRM Pipeline", "Call Transcripts"],
      };
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c));
      setIsStreaming(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: makeId(),
      title: "New Conversation",
      preview: "Start a new conversation...",
      date: "Just now",
      messages: [],
      repFilter: repFilter,
      topicFilter: topicFilter,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const handleDeleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) setActiveConvId(remaining[0].id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
      {/* ── Conversation Sidebar ── */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Chat
          </button>
        </div>

        {/* Conversation Search */}
        <div className="px-4 py-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">search</span>
            <input
              type="text"
              value={searchConv}
              onChange={e => setSearchConv(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-1">
          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Recent</p>
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-all cursor-pointer group ${
                activeConvId === conv.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${activeConvId === conv.id ? "text-primary" : "text-forest"}`}>
                    {conv.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{conv.preview}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400">{conv.date}</span>
                    {conv.repFilter !== "All Reps" && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[10px]">person</span>
                        {conv.repFilter}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConv(conv.id, e)}
                  className="p-1 text-slate-300 hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </button>
          ))}

          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-3xl text-slate-300">chat_bubble</span>
              <p className="text-xs text-slate-400 mt-2">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <span className="material-symbols-outlined text-slate-500">{sidebarOpen ? "left_panel_close" : "left_panel_open"}</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="size-7 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">psychology</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-forest">{activeConv?.title || "New Chat"}</h2>
                <p className="text-[10px] text-slate-400">Vetro AI · Vector Search</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                showFilters
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-slate-500 hover:text-forest hover:bg-slate-50 border-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Filters
              {(repFilter !== "All Reps" || topicFilter !== "All Topics") && (
                <span className="size-4 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {(repFilter !== "All Reps" ? 1 : 0) + (topicFilter !== "All Topics" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Bar (collapsible) */}
        {showFilters && (
          <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-3 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope:</span>
            {/* Rep Filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">person</span>
              <select
                value={repFilter}
                onChange={e => setRepFilter(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm cursor-pointer appearance-none"
              >
                {REPS.map(r => <option key={r}>{r}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
            </div>
            {/* Topic Filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">topic</span>
              <select
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm cursor-pointer appearance-none"
              >
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
            </div>
            {/* Date Range */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">calendar_today</span>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm cursor-pointer appearance-none"
              >
                {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
            </div>

            {/* Active filter chips */}
            {repFilter !== "All Reps" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {repFilter}
                <button onClick={() => setRepFilter("All Reps")} className="hover:text-red-500 cursor-pointer"><span className="material-symbols-outlined text-xs">close</span></button>
              </span>
            )}
            {topicFilter !== "All Topics" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                {topicFilter}
                <button onClick={() => setTopicFilter("All Topics")} className="hover:text-red-500 cursor-pointer"><span className="material-symbols-outlined text-xs">close</span></button>
              </span>
            )}
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeConv && activeConv.messages.length > 0 ? (
            <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
              {activeConv.messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                    }`}>
                      {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                    </div>
                    <div className={`flex items-center gap-2 mt-1.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-slate-400">
                        {msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                      {msg.sources && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">source</span>
                          {msg.sources.length} sources
                        </span>
                      )}
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-0.5">
                          <button className="p-0.5 text-slate-300 hover:text-primary cursor-pointer" title="Copy">
                            <span className="material-symbols-outlined text-xs">content_copy</span>
                          </button>
                          <button className="p-0.5 text-slate-300 hover:text-primary cursor-pointer" title="Thumbs up">
                            <span className="material-symbols-outlined text-xs">thumb_up</span>
                          </button>
                          <button className="p-0.5 text-slate-300 hover:text-red-400 cursor-pointer" title="Thumbs down">
                            <span className="material-symbols-outlined text-xs">thumb_down</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="size-8 rounded-xl bg-forest flex items-center justify-center shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">AR</span>
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex gap-3 justify-start">
                  <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-primary text-lg animate-pulse">psychology</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-slate-400">
                        Searching vector database
                        {repFilter !== "All Reps" && ` for ${repFilter}`}...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center h-full px-6">
              <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
              </div>
              <h2 className="text-xl font-bold text-forest mb-2">Vetro AI Assistant</h2>
              <p className="text-sm text-slate-500 max-w-md text-center mb-8">
                Query your sales call data using natural language. Filter by rep, topic, or date range to get targeted insights from the vector database.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  { icon: "trending_up", text: "Show me Alex Rivera's top-performing calls this month" },
                  { icon: "warning", text: "Which deals from Casey Webb are at churn risk?" },
                  { icon: "compare", text: "Compare Jordan Smith and Taylor Swift's win rates" },
                  { icon: "lightbulb", text: "What closing techniques work best for Morgan Lee?" },
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt.text)}
                    className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-primary text-lg mb-1 block">{prompt.icon}</span>
                    <p className="text-xs text-slate-600 group-hover:text-forest leading-relaxed">{prompt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            {/* Active filter indicators above input */}
            {(repFilter !== "All Reps" || topicFilter !== "All Topics") && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Scope:</span>
                {repFilter !== "All Reps" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[10px]">person</span>{repFilter}
                  </span>
                )}
                {topicFilter !== "All Topics" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[10px]">topic</span>{topicFilter}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${repFilter !== "All Reps" ? repFilter + "'s" : "your team's"} sales data...`}
                rows={1}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-800 placeholder:text-slate-400 resize-none min-h-[36px] max-h-[120px] py-1.5 px-2"
                style={{ height: "auto", overflow: "hidden" }}
                onInput={e => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="size-9 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span className="material-symbols-outlined text-lg">{isStreaming ? "hourglass_empty" : "arrow_upward"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Vetro AI searches your indexed call transcripts, CRM data, and pipeline metadata. Responses are AI-generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
