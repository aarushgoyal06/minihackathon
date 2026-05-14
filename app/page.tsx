"use client";

import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Download,
  Share2,
  Trash2,
  Clock,
  Flame,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoastProfile {
  name: string;
  occupation: string;
  hobbies: string;
  apps: string;
  habits: string;
  traits: string;
  embarrassingFact: string;
}

interface RoastResult {
  roastLines: string[];
  micDrop: string;
  complimentIntro: string;
  complimentOutro: string;
}

interface HistoryEntry {
  id: string;
  timestamp: number;
  profile: RoastProfile;
  intensity: string;
  result: RoastResult;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INTENSITY_OPTIONS = [
  {
    value: "Mild",
    description: "Light teasing",
    color: "from-green-600 to-emerald-500",
    glow: "rgba(34,197,94,0.4)",
    selected: "bg-gradient-to-r from-green-700 to-emerald-600 border-green-400",
  },
  {
    value: "Medium",
    description: "Sarcastic & sharp",
    color: "from-orange-600 to-amber-500",
    glow: "rgba(249,115,22,0.4)",
    selected: "bg-gradient-to-r from-orange-700 to-amber-600 border-orange-400",
  },
  {
    value: "Savage",
    description: "Bold & brutal",
    color: "from-red-600 to-pink-600",
    glow: "rgba(239,68,68,0.4)",
    selected: "bg-gradient-to-r from-red-700 to-pink-600 border-red-400",
  },
];

const EMPTY_PROFILE: RoastProfile = {
  name: "",
  occupation: "",
  hobbies: "",
  apps: "",
  habits: "",
  traits: "",
  embarrassingFact: "",
};

const STORAGE_KEY = "roast-history-v1";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 10)));
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── NeonInput ────────────────────────────────────────────────────────────────

function NeonInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  optional?: boolean;
}) {
  const base =
    "neon-input w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 resize-none";
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
        {label}{" "}
        {optional && (
          <span className="normal-case text-slate-500 font-normal">
            (optional)
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          className={`${base} min-h-[80px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className={base}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

// ─── RoastCard ────────────────────────────────────────────────────────────────

function RoastCard({
  result,
  intensity,
  complimentSandwich,
}: {
  result: RoastResult;
  intensity: string;
  complimentSandwich: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const fullText = [
    complimentSandwich && result.complimentIntro
      ? `💚 ${result.complimentIntro}`
      : "",
    ...result.roastLines.map((l, i) => `🔥 ${i + 1}. ${l}`),
    `\n🎤 MIC DROP: ${result.micDrop}`,
    complimentSandwich && result.complimentOutro
      ? `\n💜 ${result.complimentOutro}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const { default: html2canvas } = await import("html2canvas");
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#0f0f1e",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `roast-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "AI Roast Generator 🔥",
        text: fullText,
        url: window.location.href,
      });
    } else {
      await handleCopy();
    }
  };

  const intensityEmoji =
    intensity === "Mild" ? "😊" : intensity === "Medium" ? "🌶️" : "🔥";

  return (
    <div className="space-y-4 fade-in">
      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <Button
          onClick={handleCopy}
          size="sm"
          className="bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 gap-1.5"
        >
          {copied ? (
            <CheckCheck className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          onClick={handleDownload}
          size="sm"
          className="bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/40 text-cyan-200 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </Button>
        <Button
          onClick={handleShare}
          size="sm"
          className="bg-pink-900/60 hover:bg-pink-800 border border-pink-500/40 text-pink-200 gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>
      </div>

      {/* Roast card */}
      <div ref={cardRef} className="neon-card rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{intensityEmoji}</span>
          <span className="shimmer-text font-black text-xl tracking-tight">
            YOUR ROAST
          </span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300">
            {intensity}
          </span>
        </div>

        {/* Compliment intro */}
        {complimentSandwich && result.complimentIntro && (
          <div className="rounded-lg bg-green-950/40 border border-green-500/20 p-3 text-green-300 text-sm italic slide-in">
            💚 {result.complimentIntro}
          </div>
        )}

        {/* Roast lines */}
        <div className="space-y-3">
          {result.roastLines.map((line, i) => (
            <div
              key={i}
              className="roast-line pl-4 py-1 text-slate-100 text-sm leading-relaxed slide-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-purple-400 font-bold mr-2">{i + 1}.</span>
              {line}
            </div>
          ))}
        </div>

        {/* Mic drop */}
        <div className="mic-drop rounded-xl p-4 mt-4 slide-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎤</span>
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
              Mic Drop
            </span>
          </div>
          <p className="text-white font-bold text-base leading-snug">
            {result.micDrop}
          </p>
        </div>

        {/* Compliment outro */}
        {complimentSandwich && result.complimentOutro && (
          <div className="rounded-lg bg-purple-950/40 border border-purple-500/20 p-3 text-purple-300 text-sm italic slide-in">
            💜 {result.complimentOutro}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HistoryPanel ─────────────────────────────────────────────────────────────

function HistoryPanel({
  history,
  onLoad,
  onClear,
}: {
  history: HistoryEntry[];
  onLoad: (e: HistoryEntry) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (history.length === 0) return null;

  return (
    <div className="neon-card rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-200 text-sm">
            Roast History
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300">
            {history.length}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-3 fade-in">
          <div className="flex justify-end">
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear history
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onLoad(entry)}
                className="w-full text-left rounded-lg p-3 border border-slate-700/50 hover:border-purple-500/40 bg-slate-900/40 hover:bg-slate-800/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-400 font-medium">
                    {entry.intensity} roast
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 group-hover:text-slate-300">
                  {entry.result.micDrop}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [profile, setProfile] = useState<RoastProfile>(EMPTY_PROFILE);
  const [intensity, setIntensity] = useState("Medium");
  const [complimentSandwich, setComplimentSandwich] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const updateProfile = (key: keyof RoastProfile) => (val: string) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const isFormValid =
    profile.occupation.trim() !== "" ||
    profile.hobbies.trim() !== "" ||
    profile.habits.trim() !== "";

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, intensity, complimentSandwich }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        profile,
        intensity,
        result: data,
      };
      const updated = [entry, ...history].slice(0, 10);
      setHistory(updated);
      saveHistory(updated);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = (entry: HistoryEntry) => {
    setProfile(entry.profile);
    setIntensity(entry.intensity);
    setResult(entry.result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const selectedIntensity =
    INTENSITY_OPTIONS.find((o) => o.value === intensity) ?? INTENSITY_OPTIONS[1];

  return (
    <main className="min-h-screen py-10 px-4">
      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Flame className="w-8 h-8 text-orange-400" />
          <h1 className="neon-title text-4xl sm:text-5xl font-black tracking-tight text-purple-400">
            AI Roast Generator
          </h1>
          <Flame className="w-8 h-8 text-orange-400" />
        </div>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Get funny, personalized roasts powered by AI. Enter your details,
          choose your intensity, and brace yourself. 😈
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT: Form ── */}
        <div className="space-y-6">
          <div className="neon-card rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="font-bold text-slate-200">Your Profile</h2>
            </div>

            <NeonInput
              label="Name / Nickname"
              value={profile.name}
              onChange={updateProfile("name")}
              placeholder="e.g. Alex, The Algorithm Whisperer"
              optional
            />
            <NeonInput
              label="Occupation / Major"
              value={profile.occupation}
              onChange={updateProfile("occupation")}
              placeholder="e.g. Software Engineer, CS major, Marketing intern"
            />
            <NeonInput
              label="Hobbies & Interests"
              value={profile.hobbies}
              onChange={updateProfile("hobbies")}
              placeholder="e.g. Gaming, hiking, doomscrolling, collecting Funko Pops"
              multiline
            />
            <NeonInput
              label="Favorite Apps / Websites"
              value={profile.apps}
              onChange={updateProfile("apps")}
              placeholder="e.g. TikTok, Reddit, LinkedIn, Stack Overflow"
            />
            <NeonInput
              label="Common Habits"
              value={profile.habits}
              onChange={updateProfile("habits")}
              placeholder="e.g. Says 'I'll start early' but begins at midnight"
              multiline
            />
            <NeonInput
              label="Personality Traits"
              value={profile.traits}
              onChange={updateProfile("traits")}
              placeholder="e.g. Overthinks everything, procrastinator, caffeine-dependent"
            />
            <NeonInput
              label="One Embarrassing Fact"
              value={profile.embarrassingFact}
              onChange={updateProfile("embarrassingFact")}
              placeholder="e.g. Still quotes Vine in 2024"
              optional
            />
          </div>

          {/* ── Intensity ── */}
          <div className="neon-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h2 className="font-bold text-slate-200">Roast Intensity</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {INTENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIntensity(opt.value)}
                  className={`intensity-btn rounded-xl p-3 text-center border transition-all font-semibold text-sm ${
                    intensity === opt.value
                      ? opt.selected + " text-white shadow-lg"
                      : "border-slate-700 bg-slate-900/40 text-slate-400 hover:border-slate-500"
                  }`}
                  style={
                    intensity === opt.value
                      ? { boxShadow: `0 0 20px ${opt.glow}` }
                      : {}
                  }
                >
                  <div className="text-lg mb-1">
                    {opt.value === "Mild"
                      ? "😊"
                      : opt.value === "Medium"
                      ? "🌶️"
                      : "��"}
                  </div>
                  <div>{opt.value}</div>
                  <div className="text-xs font-normal opacity-70 mt-0.5">
                    {opt.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Options ── */}
          <div className="neon-card rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  complimentSandwich ? "bg-purple-600" : "bg-slate-700"
                }`}
                onClick={() => setComplimentSandwich((v) => !v)}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    complimentSandwich ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  💚 Compliment Sandwich Mode
                </div>
                <div className="text-xs text-slate-500">
                  Wrap roast with kind intro &amp; outro
                </div>
              </div>
            </label>
          </div>

          {/* ── Generate Button ── */}
          <button
            onClick={handleGenerate}
            disabled={loading || !isFormValid}
            className={`w-full py-4 rounded-xl font-black text-base tracking-wide transition-all ${
              loading || !isFormValid
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : `bg-gradient-to-r ${selectedIntensity.color} text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]`
            }`}
            style={
              !loading && isFormValid
                ? { boxShadow: `0 0 30px ${selectedIntensity.glow}` }
                : {}
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-xl">🔥</span>
                <span className="cooking-text">Cooking your roast</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" />
                Roast Me!
              </span>
            )}
          </button>

          {!isFormValid && (
            <p className="text-center text-xs text-slate-500">
              Fill in at least one field to generate a roast.
            </p>
          )}
        </div>

        {/* ── RIGHT: Output + History ── */}
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl p-4 border border-red-500/40 bg-red-950/30 text-red-400 text-sm fade-in">
              ⚠️ {error}
            </div>
          )}

          {result && (
            <RoastCard
              result={result}
              intensity={intensity}
              complimentSandwich={complimentSandwich}
            />
          )}

          {!result && !loading && !error && (
            <div className="neon-card rounded-xl p-10 text-center space-y-3">
              <div className="text-5xl">🎭</div>
              <p className="text-slate-400 text-sm">
                Your roast will appear here.
              </p>
              <p className="text-slate-600 text-xs">
                Fill out your profile and hit{" "}
                <span className="text-purple-400">Roast Me!</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="neon-card rounded-xl p-10 text-center space-y-4 fade-in">
              <div className="text-5xl animate-bounce">🔥</div>
              <div className="text-purple-300 font-semibold">
                <span className="cooking-text">Cooking your roast</span>
              </div>
              <p className="text-slate-500 text-xs">
                AI is carefully judging your life choices…
              </p>
            </div>
          )}

          <HistoryPanel
            history={history}
            onLoad={handleLoadHistory}
            onClear={handleClearHistory}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="max-w-4xl mx-auto mt-16 text-center text-xs text-slate-600 space-y-1">
        <p>🤖 Roasts are AI-generated for entertainment only.</p>
        <p>Built with Next.js · Tailwind CSS · OpenAI · Made with ❤️ and 🔥</p>
      </footer>
    </main>
  );
}
