"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";

const STOCKS = [
  { ticker: "NVDA", name: "NVIDIA Corp", sector: "Tech", price: 875.40, change: 2.4, vol: "High" },
  { ticker: "TSLA", name: "Tesla Inc", sector: "Auto", price: 177.90, change: -1.8, vol: "High" },
  { ticker: "AAPL", name: "Apple Inc", sector: "Tech", price: 213.50, change: 0.6, vol: "Low" },
  { ticker: "MSFT", name: "Microsoft Corp", sector: "Tech", price: 415.20, change: 1.1, vol: "Low" },
  { ticker: "AMZN", name: "Amazon.com", sector: "E-Comm", price: 198.70, change: 0.9, vol: "Med" },
  { ticker: "META", name: "Meta Platforms", sector: "Social", price: 524.30, change: 3.2, vol: "Med" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Finance", price: 212.80, change: -0.3, vol: "Low" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Health", price: 147.60, change: 0.2, vol: "Low" },
  { ticker: "XOM", name: "ExxonMobil", sector: "Energy", price: 118.90, change: -0.7, vol: "Med" },
  { ticker: "PLTR", name: "Palantir Tech", sector: "Tech", price: 24.80, change: 5.1, vol: "High" },
  { ticker: "RIVN", name: "Rivian Auto", sector: "Auto", price: 11.20, change: -3.4, vol: "High" },
  { ticker: "AMD", name: "Advanced Micro", sector: "Tech", price: 168.30, change: 1.7, vol: "Med" },
  { ticker: "COIN", name: "Coinbase", sector: "Crypto", price: 238.60, change: 4.8, vol: "High" },
  { ticker: "UBER", name: "Uber Tech", sector: "Transport", price: 79.40, change: 1.3, vol: "Med" },
  { ticker: "NFLX", name: "Netflix Inc", sector: "Media", price: 685.20, change: 0.8, vol: "Med" },
  { ticker: "GS", name: "Goldman Sachs", sector: "Finance", price: 471.50, change: -0.5, vol: "Low" },
  { ticker: "PYPL", name: "PayPal Holdings", sector: "Fintech", price: 62.30, change: -2.1, vol: "Med" },
  { ticker: "SPOT", name: "Spotify", sector: "Media", price: 327.80, change: 2.6, vol: "Med" },
  { ticker: "SNOW", name: "Snowflake Inc", sector: "Cloud", price: 156.40, change: -1.2, vol: "High" },
  { ticker: "DIS", name: "Walt Disney Co", sector: "Media", price: 99.80, change: 0.4, vol: "Low" },
];

const SLOT_CONFIG = [
  { id: "anchor", label: "Anchor", desc: "Safe, defensive pick", icon: "⚓", color: "#4a9eff", mult: 1 },
  { id: "swing1", label: "Swing Play", desc: "Medium risk/reward", icon: "📈", color: "#a78bfa", mult: 1.5 },
  { id: "swing2", label: "Swing Play", desc: "Medium risk/reward", icon: "📈", color: "#a78bfa", mult: 1.5 },
  { id: "moonshot", label: "Moon Shot", desc: "High risk, big upside", icon: "🚀", color: "#f59e0b", mult: 2.5 },
  { id: "hedge", label: "Hedge", desc: "Your downside protection", icon: "🛡️", color: "#34d399", mult: 1 },
];

const sectorColors: Record<string, string> = {
  Tech: "#4a9eff", Auto: "#f59e0b", Finance: "#34d399", Health: "#a78bfa",
  Energy: "#fb923c", "E-Comm": "#60a5fa", Social: "#f472b6", Media: "#818cf8",
  Cloud: "#38bdf8", Crypto: "#fbbf24", Fintech: "#4ade80", Transport: "#fb7185",
};

function MiniChart({ change }: { change: number }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const noise = (Math.random() - 0.5) * 2;
    return 20 - (change * i * 0.4 + noise);
  });
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const pts = points.map((v, i) => `${i * 11},${((v - min) / range) * 24}`).join(" ");
  return (
    <svg width="77" height="28" viewBox="0 0 77 28" style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={change >= 0 ? "#34d399" : "#f87171"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ConvictionDots({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} style={{
          width: 22, height: 22, borderRadius: "50%", border: "none", cursor: "pointer",
          background: i <= value ? "#f59e0b" : "#1e2433",
          transition: "all 0.15s",
          boxShadow: i <= value ? "0 0 8px #f59e0b66" : "none",
        }} />
      ))}
      <span style={{ fontSize: 11, color: "#f59e0b", marginLeft: 4, fontWeight: 600 }}>{value}x</span>
    </div>
  );
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "24px 0" }}>
      {[["days", timeLeft.days], ["hrs", timeLeft.hours], ["min", timeLeft.minutes], ["sec", timeLeft.seconds]].map(([label, val]) => (
        <div key={label as string} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40, color: "#f59e0b", lineHeight: 1, minWidth: 60 }}>
            {String(val).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 9, color: "#3d4a5c", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{label as string}</div>
        </div>
      ))}
    </div>
  );
}

export default function PlayPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState("");

  const [screen, setScreen] = useState("leagues");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [myLeagues, setMyLeagues] = useState<any[]>([]);
  const [publicLeagues, setPublicLeagues] = useState<any[]>([]);
  const [activeLeague, setActiveLeague] = useState<any>(null);
  const [leagueMembers, setLeagueMembers] = useState<any[]>([]);
  const [readyMembers, setReadyMembers] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [showJoinLeague, setShowJoinLeague] = useState(false);
  const [showScheduleDraft, setShowScheduleDraft] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [leagueError, setLeagueError] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [now, setNow] = useState(Date.now());

  const [draftPool, setDraftPool] = useState([...STOCKS]);
  const [myDrafted, setMyDrafted] = useState<typeof STOCKS>([]);
  const [oppDrafted, setOppDrafted] = useState<typeof STOCKS>([]);
  const [draftRound, setDraftRound] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [lineup, setLineup] = useState<Record<string, typeof STOCKS[0]>>({});
  const [convictions, setConvictions] = useState<Record<string, number>>({ anchor: 1, swing1: 1, swing2: 1, moonshot: 3, hedge: 1 });
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const filteredPool = draftPool.filter(s =>
    s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calcScore = (slotId: string) => {
    const stock = lineup[slotId];
    if (!stock) return 0;
    const slot = SLOT_CONFIG.find(s => s.id === slotId);
    if (!slot) return 0;
    return Math.round(stock.change * slot.mult * (convictions[slotId] || 1) * 100);
  };

  const totalScore = SLOT_CONFIG.reduce((sum, s) => sum + Math.max(0, calcScore(s.id)), 0);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeagueDetails = useCallback(async (leagueId: string) => {
    const { data: members } = await supabase.from("league_members").select("*, profiles(*)").eq("league_id", leagueId);
    if (members) setLeagueMembers(members);
    const { data: ready } = await supabase.from("draft_ready").select("*, profiles(*)").eq("league_id", leagueId);
    if (ready) setReadyMembers(ready);
  }, []);

  const fetchLeagues = useCallback(async (userId: string) => {
    const { data: memberLeagues } = await supabase.from("league_members").select("league_id, leagues(*)").eq("user_id", userId);
    if (memberLeagues) setMyLeagues(memberLeagues.map((m: any) => m.leagues).filter(Boolean));
    const { data: pubLeagues } = await supabase.from("leagues").select("*").eq("is_public", true).limit(10);
    if (pubLeagues) setPublicLeagues(pubLeagues);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchLeagues(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchLeagues(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [fetchLeagues]);

  useEffect(() => {
    if (!activeLeague) return;
    fetchLeagueDetails(activeLeague.id);
    const channel = supabase.channel(`league-${activeLeague.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "draft_ready", filter: `league_id=eq.${activeLeague.id}` }, () => fetchLeagueDetails(activeLeague.id))
      .on("postgres_changes", { event: "*", schema: "public", table: "leagues", filter: `id=eq.${activeLeague.id}` }, async () => {
        const { data } = await supabase.from("leagues").select("*").eq("id", activeLeague.id).single();
        if (data) setActiveLeague(data);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeLeague?.id, fetchLeagueDetails]);

  const signUp = async () => {
    if (!authEmail || !authPassword || !authName) { setAuthError("Please fill in all fields"); return; }
    if (authPassword.length < 6) { setAuthError("Password must be at least 6 characters"); return; }
    setAuthLoading(true);
    setAuthError("");
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: { data: { full_name: authName } }
    });
    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        setAuthError("Account already exists — log in instead!");
        setAuthMode("login");
      } else {
        setAuthError(error.message);
      }
      setAuthLoading(false);
      return;
    }
    if (data.user && data.session) {
      await supabase.from("profiles").upsert({ id: data.user.id, email: authEmail, full_name: authName });
    } else {
      setAuthError("Check your email to confirm your account, then log in.");
      setAuthMode("login");
    }
    setAuthLoading(false);
  };

  const signIn = async () => {
    if (!authEmail || !authPassword) { setAuthError("Please fill in all fields"); return; }
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) {
      setAuthError("Wrong email or password. No account? Switch to Sign Up.");
    }
    setAuthLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMyLeagues([]);
    setActiveLeague(null);
    setScreen("leagues");
  };

  const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createLeague = async () => {
    if (!leagueName.trim()) { setLeagueError("Enter a league name"); return; }
    const { data, error } = await supabase.from("leagues").insert({
      name: leagueName, invite_code: generateInviteCode(), is_public: isPublic, created_by: user.id,
    }).select().single();
    if (error) { setLeagueError("Something went wrong"); return; }
    await supabase.from("league_members").insert({ league_id: data.id, user_id: user.id });
    setMyLeagues(prev => [...prev, data]);
    setShowCreateLeague(false);
    setLeagueName("");
    setIsPublic(false);
    setLeagueError("");
    setActiveLeague(data);
    setScreen("lobby");
  };

  const joinLeague = async (leagueId?: string, code?: string) => {
    let league = null;
    if (leagueId) {
      const { data } = await supabase.from("leagues").select("*").eq("id", leagueId).single();
      league = data;
    } else if (code) {
      const { data } = await supabase.from("leagues").select("*").eq("invite_code", code.toUpperCase()).single();
      if (!data) { setLeagueError("Invalid invite code"); return; }
      league = data;
    }
    if (!league) return;
    await supabase.from("league_members").insert({ league_id: league.id, user_id: user.id });
    setMyLeagues(prev => [...prev.filter(l => l.id !== league.id), league]);
    setActiveLeague(league);
    setShowJoinLeague(false);
    setJoinCode("");
    setLeagueError("");
    setScreen("lobby");
  };

  const scheduleDraft = async () => {
    if (!draftDate || !draftTime) return;
    const fullDate = new Date(`${draftDate}T${draftTime}`).toISOString();
    const { data, error } = await supabase.from("leagues").update({ draft_date: fullDate }).eq("id", activeLeague.id).select().single();
    if (!error && data) { setActiveLeague(data); setMyLeagues(prev => prev.map(l => l.id === data.id ? data : l)); }
    setShowScheduleDraft(false);
  };

  const markReady = async () => {
    if (isReady) {
      await supabase.from("draft_ready").delete().eq("league_id", activeLeague.id).eq("user_id", user.id);
      setIsReady(false);
    } else {
      await supabase.from("draft_ready").insert({ league_id: activeLeague.id, user_id: user.id });
      setIsReady(true);
    }
    fetchLeagueDetails(activeLeague.id);
  };

  const startDraft = async () => {
    await supabase.from("leagues").update({ draft_started: true }).eq("id", activeLeague.id);
    setScreen("draft");
  };

  const draftPick = (stock: typeof STOCKS[0]) => {
    setMyDrafted(prev => [...prev, stock]);
    setDraftPool(prev => prev.filter(s => s.ticker !== stock.ticker));
    setTimeout(() => {
      setDraftPool(prev => {
        if (prev.length === 0) return prev;
        const oppPick = prev[Math.floor(Math.random() * Math.min(3, prev.length))];
        setOppDrafted(p => [...p, oppPick]);
        return prev.filter(s => s.ticker !== oppPick.ticker);
      });
      setDraftRound(r => r + 1);
    }, 800);
  };

  const assignToSlot = (stock: typeof STOCKS[0], slotId: string) => {
    setLineup(prev => {
      const n = { ...prev };
      Object.keys(n).forEach(k => { if (n[k]?.ticker === stock.ticker) delete n[k]; });
      n[slotId] = stock;
      return n;
    });
    setActiveSlot(null);
  };

  const isOwner = activeLeague?.created_by === user?.id;
  const draftDateObj = activeLeague?.draft_date ? new Date(activeLeague.draft_date) : null;
  const draftIsPast = true;
  const allReady = leagueMembers.length > 0 && readyMembers.length >= leagueMembers.length;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #080c14; height: 100%; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0d1117; }
    ::-webkit-scrollbar-thumb { background: #1e2433; border-radius: 2px; }
    .app { display: flex; height: 100vh; background: #080c14; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; overflow: hidden; }
    .sidebar { width: 260px; background: #0d1117; border-right: 1px solid #1e2433; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.3s; overflow: hidden; }
    .sidebar.closed { width: 0; }
    .sidebar-header { padding: 20px 16px; border-bottom: 1px solid #1e2433; flex-shrink: 0; }
    .sidebar-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; }
    .sidebar-logo span { color: #f59e0b; }
    .sidebar-section { padding: 16px; border-bottom: 1px solid #1e2433; overflow-y: auto; }
    .sidebar-section-title { font-size: 9px; letter-spacing: 0.2em; color: #3d4a5c; text-transform: uppercase; margin-bottom: 10px; }
    .league-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.15s; margin-bottom: 4px; }
    .league-item:hover { background: #1e2433; }
    .league-item.active { background: #f59e0b18; border: 1px solid #f59e0b33; }
    .league-name { font-size: 12px; color: #94a3b8; font-family: 'Syne', sans-serif; font-weight: 600; }
    .league-meta { font-size: 10px; color: #3d4a5c; margin-top: 2px; }
    .sidebar-btn { width: 100%; padding: 8px 12px; background: transparent; border: 1px solid #1e2433; border-radius: 6px; color: #3d4a5c; font-family: 'JetBrains Mono', monospace; font-size: 10px; cursor: pointer; text-align: left; transition: all 0.15s; letter-spacing: 0.05em; margin-bottom: 6px; }
    .sidebar-btn:hover { border-color: #f59e0b44; color: #f59e0b; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { padding: 0 20px; height: 56px; background: #0d1117; border-bottom: 1px solid #1e2433; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .content { flex: 1; overflow-y: auto; padding: 24px; }
    .btn-gold { background: #f59e0b; color: #080c14; border: none; padding: 12px 24px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
    .btn-gold:hover { background: #fbbf24; }
    .btn-ghost { background: transparent; color: #64748b; padding: 10px 20px; border: 1px solid #1e2433; border-radius: 8px; font-size: 11px; font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s; }
    .btn-ghost:hover { border-color: #3d4a5c; color: #94a3b8; }
    .btn-green { background: #34d399; color: #080c14; border: none; padding: 12px 24px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
    .card { background: #0d1117; border: 1px solid #1e2433; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .stock-row { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #0d1117; cursor: pointer; transition: background 0.15s; gap: 12px; }
    .stock-row:hover { background: #0d1421; }
    .stock-row.drafted { opacity: 0.3; pointer-events: none; }
    .pill { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
    .slot-card { border: 1px solid #1e2433; border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; background: #0d1117; }
    .slot-card:hover { border-color: #2a3550; }
    .slot-card.filled { background: #0a1628; }
    .slot-card.active-slot { border-color: #f59e0b; background: #150f01; }
    .score-bar { height: 3px; background: #1e2433; border-radius: 2px; overflow: hidden; }
    .score-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
    .modal-overlay { position: fixed; inset: 0; background: #000a; display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: #0d1117; border: 1px solid #1e2433; border-radius: 16px; padding: 28px; width: 420px; max-width: 90vw; }
    .modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 20px; }
    .input { width: 100%; background: #080c14; border: 1px solid #1e2433; border-radius: 8px; padding: 12px 14px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 12px; outline: none; transition: border-color 0.2s; margin-bottom: 12px; }
    .input:focus { border-color: #f59e0b44; }
    .input::placeholder { color: #2a3550; }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-top: 1px solid #1e2433; margin-bottom: 16px; }
    .toggle { width: 40px; height: 22px; background: #1e2433; border-radius: 11px; position: relative; cursor: pointer; transition: background 0.2s; border: none; }
    .toggle.on { background: #f59e0b; }
    .toggle::after { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; }
    .toggle.on::after { transform: translateX(18px); }
    .nav-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: #0d1117; padding: 4px; border-radius: 10px; border: 1px solid #1e2433; width: fit-content; }
    .nav-tab { padding: 8px 20px; border-radius: 7px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border: none; background: transparent; color: #3d4a5c; font-family: 'JetBrains Mono', monospace; transition: all 0.2s; }
    .nav-tab.active { background: #f59e0b; color: #080c14; font-weight: 600; }
    .member-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #111; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: #1e2433; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #64748b; overflow: hidden; flex-shrink: 0; }
    .ready-badge { padding: 3px 10px; border-radius: 20px; font-size: 9px; letter-spacing: 0.1em; font-weight: 600; }
    .error-text { font-size: 11px; color: #f87171; margin-bottom: 12px; }
    .success-text { font-size: 11px; color: #34d399; margin-bottom: 12px; }
    .auth-tab { padding: 8px 20px; border-radius: 7px; font-size: 11px; cursor: pointer; border: none; background: transparent; color: #3d4a5c; font-family: 'JetBrains Mono', monospace; transition: all 0.2s; letter-spacing: 0.05em; }
    .auth-tab.active { background: #f59e0b; color: #080c14; font-weight: 600; }
  `;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{styles}</style>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>CONVICTION</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{styles}</style>
      <div style={{ maxWidth: 400, width: "100%", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>
            CONVIC<span style={{ color: "#f59e0b" }}>TION</span>
          </div>
          <div style={{ fontSize: 12, color: "#3d4a5c", lineHeight: 1.7 }}>Fantasy stock leagues where your thesis is on the line.</div>
        </div>

        <div style={{ display: "flex", gap: 4, background: "#0d1117", padding: 4, borderRadius: 10, border: "1px solid #1e2433", marginBottom: 24 }}>
          <button className={`auth-tab ${authMode === "login" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccess(""); }}>Log In</button>
          <button className={`auth-tab ${authMode === "signup" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthSuccess(""); }}>Sign Up</button>
        </div>

        {authError && <div className="error-text">{authError}</div>}
        {authSuccess && <div className="success-text">{authSuccess}</div>}

        <button onClick={async () => {
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: typeof window !== "undefined" ? `${window.location.origin}/play` : "https://conviction-eta.vercel.app/play" }
          });
        }} style={{
          width: "100%", padding: "12px 24px", background: "#fff", color: "#080c14",
          border: "none", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16
        }}>
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#1e2433" }} />
          <span style={{ fontSize: 10, color: "#2a3550" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#1e2433" }} />
        </div>

        {authMode === "signup" && (
          <input className="input" placeholder="Your name" value={authName} onChange={e => setAuthName(e.target.value)} />
        )}
        <input className="input" type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (authMode === "login" ? signIn() : signUp())} />

        <button className="btn-gold" style={{ width: "100%" }} onClick={authMode === "login" ? signIn : signUp} disabled={authLoading}>
          {authLoading ? "..." : authMode === "login" ? "Log In" : "Create Account"}
        </button>

        <div style={{ fontSize: 10, color: "#1e2433", marginTop: 20, textAlign: "center" }}>Free to play · No financial risk</div>
      </div>
    </div>
  );

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Player";

  return (
    <div className="app">
      <style>{styles}</style>

      <div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">CONVIC<span>TION</span></div>
        </div>
        <div className="sidebar-section" style={{ flex: 1 }}>
          <div className="sidebar-section-title">Your Leagues</div>
          {myLeagues.length === 0 && <div style={{ fontSize: 11, color: "#2a3550", padding: "8px 0" }}>No leagues yet</div>}
          {myLeagues.map(league => (
            <div key={league?.id} className={`league-item ${activeLeague?.id === league?.id ? "active" : ""}`}
              onClick={() => { setActiveLeague(league); setScreen("lobby"); }}>
              <div className="league-name">{league?.name}</div>
              <div className="league-meta">{league?.is_public ? "Public" : "Private"} · {league?.invite_code}</div>
            </div>
          ))}
          <button className="sidebar-btn" onClick={() => setShowCreateLeague(true)}>+ Create League</button>
          <button className="sidebar-btn" onClick={() => setShowJoinLeague(true)}>+ Join with Code</button>
        </div>
        <div className="sidebar-section" style={{ maxHeight: 200, overflowY: "auto" }}>
          <div className="sidebar-section-title">Public Leagues</div>
          {publicLeagues.length === 0 && <div style={{ fontSize: 11, color: "#2a3550", padding: "8px 0" }}>None yet</div>}
          {publicLeagues.map(league => (
            <div key={league.id} className="league-item" onClick={() => joinLeague(league.id)}>
              <div className="league-name">{league.name}</div>
              <div className="league-meta" style={{ color: "#34d399" }}>Tap to join</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1e2433", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div className="avatar">{userName[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Syne', sans-serif", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
          </div>
          <button onClick={signOut} style={{ background: "none", border: "none", color: "#3d4a5c", cursor: "pointer", fontSize: 11 }}>Out</button>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ background: "none", border: "none", color: "#3d4a5c", cursor: "pointer", fontSize: 18, padding: 4 }} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#64748b" }}>{activeLeague ? activeLeague.name : "Select a League"}</span>
          </div>
          {activeLeague && (
            <div style={{ fontSize: 10, color: "#3d4a5c", padding: "6px 10px", background: "#080c14", border: "1px solid #1e2433", borderRadius: 6 }}>
              Code: <span style={{ color: "#f59e0b", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{activeLeague.invite_code}</span>
            </div>
          )}
        </div>

        <div className="content">
          {!activeLeague ? (
            <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🏆</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Join or Create a League</h2>
              <p style={{ fontSize: 12, color: "#3d4a5c", lineHeight: 1.7, marginBottom: 32 }}>Create a private league and invite your friends, or join a public league to compete with strangers.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn-gold" onClick={() => setShowCreateLeague(true)}>Create League</button>
                <button className="btn-ghost" onClick={() => setShowJoinLeague(true)}>Join with Code</button>
              </div>
            </div>
          ) : (
            <>
              <div className="nav-tabs">
                {[["lobby", "🏠 Lobby"], ["draft", "📋 Draft"], ["lineup", "💼 Lineup"], ["matchup", "⚔️ Matchup"]].map(([id, label]) => (
                  <button key={id} className={`nav-tab ${screen === id ? "active" : ""}`} onClick={() => setScreen(id)}>{label}</button>
                ))}
              </div>

              {screen === "lobby" && (
                <div style={{ maxWidth: 600 }}>
                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{activeLeague.name}</h2>
                    <div style={{ fontSize: 11, color: "#3d4a5c" }}>
                      {activeLeague.is_public ? "Public" : "Private"} · Invite code: <span style={{ color: "#f59e0b" }}>{activeLeague.invite_code}</span>
                    </div>
                  </div>

                  <div className="card">
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#3d4a5c", textTransform: "uppercase", marginBottom: 16 }}>Draft Schedule</div>
                    {!activeLeague.draft_date ? (
                      <div>
                        <div style={{ fontSize: 12, color: "#3d4a5c", marginBottom: 16 }}>No draft scheduled yet.</div>
                        {isOwner && <button className="btn-gold" onClick={() => setShowScheduleDraft(true)}>Schedule Draft</button>}
                        {!isOwner && <div style={{ fontSize: 11, color: "#2a3550" }}>Waiting for the league owner to schedule the draft...</div>}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                          {new Date(activeLeague.draft_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                        <div style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>
                          {new Date(activeLeague.draft_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {draftDateObj && draftDateObj.getTime() > now ? (
                          <>
                            <div style={{ fontSize: 10, color: "#3d4a5c", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Starts in</div>
                            <Countdown targetDate={activeLeague.draft_date} />
                          </>
                        ) : (
                          <div style={{ padding: "12px 16px", background: "#34d39918", border: "1px solid #34d39933", borderRadius: 8, fontSize: 12, color: "#34d399", marginBottom: 16 }}>✓ Draft time has arrived!</div>
                        )}
                        {isOwner && <button className="btn-ghost" style={{ fontSize: 10, padding: "8px 14px", marginTop: 8 }} onClick={() => setShowScheduleDraft(true)}>Reschedule</button>}
                      </div>
                    )}
                  </div>

                  <div className="card">
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#3d4a5c", textTransform: "uppercase", marginBottom: 16 }}>
                      Members ({leagueMembers.length}) · {readyMembers.length} Ready
                    </div>
                    {leagueMembers.map(member => {
                      const profile = member.profiles;
                      const memberReady = readyMembers.find((r: any) => r.user_id === member.user_id);
                      return (
                        <div key={member.id} className="member-row">
                          <div className="avatar">{(profile?.full_name || profile?.email || "?")[0].toUpperCase()}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                              {profile?.full_name || profile?.email || "Member"} {member.user_id === user.id && <span style={{ fontSize: 9, color: "#f59e0b" }}>YOU</span>}
                            </div>
                            {activeLeague.created_by === member.user_id && <div style={{ fontSize: 9, color: "#3d4a5c" }}>League Owner</div>}
                          </div>
                          <div className="ready-badge" style={{ background: memberReady ? "#34d39918" : "#1e2433", color: memberReady ? "#34d399" : "#3d4a5c" }}>
                            {memberReady ? "✓ Ready" : "Not Ready"}
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                      {draftIsPast && (
                        <button className={isReady ? "btn-ghost" : "btn-green"} onClick={markReady}>
                          {isReady ? "✓ Ready (undo)" : "Mark as Ready"}
                        </button>
                      )}
                      {isOwner && (allReady || leagueMembers.length === 1) && (
                        <button className="btn-gold" onClick={startDraft}>Start Draft →</button>
                      )}
                      {isOwner && !allReady && leagueMembers.length > 1 && (
                        <button className="btn-ghost" onClick={startDraft}>Start Anyway →</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {screen === "draft" && (
                <div style={{ maxWidth: 700 }}>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Live Draft</h2>
                    <div style={{ fontSize: 11, color: "#3d4a5c" }}>Round {draftRound} · Pick {myDrafted.length}/5</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[["You", myDrafted], ["Opponent", oppDrafted]].map(([name, drafted]: any) => (
                      <div key={name as string} className="card" style={{ padding: 14 }}>
                        <div style={{ fontSize: 9, color: "#3d4a5c", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{name as string}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                          {[...Array(5)].map((_, i) => (
                            <div key={i} style={{
                              padding: "4px 8px", borderRadius: 4,
                              background: drafted[i] ? (name === "You" ? "#f59e0b22" : "#1e2433") : "#080c14",
                              border: `1px solid ${drafted[i] ? (name === "You" ? "#f59e0b44" : "#2a3550") : "#1e2433"}`,
                              fontSize: 11, color: drafted[i] ? (name === "You" ? "#f59e0b" : "#64748b") : "#1e2433",
                              fontWeight: 700, fontFamily: "'Syne', sans-serif"
                            }}>
                              {drafted[i]?.ticker || "—"}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <input className="input" placeholder="Search stocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 0 }} />
                  <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
                    {filteredPool.map(stock => {
                      const drafted = myDrafted.find(s => s.ticker === stock.ticker);
                      const oppDraft = oppDrafted.find(s => s.ticker === stock.ticker);
                      return (
                        <div key={stock.ticker} className={`stock-row ${drafted || oppDraft ? "drafted" : ""}`}
                          onClick={() => !drafted && !oppDraft && myDrafted.length < 5 && draftPick(stock)}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: sectorColors[stock.sector] || "#64748b", width: 52 }}>{stock.ticker}</span>
                              <span className="pill" style={{ background: `${sectorColors[stock.sector]}18`, color: sectorColors[stock.sector] }}>{stock.sector}</span>
                              <span className="pill" style={{ background: stock.vol === "High" ? "#f8717118" : stock.vol === "Low" ? "#34d39918" : "#f59e0b18", color: stock.vol === "High" ? "#f87171" : stock.vol === "Low" ? "#34d399" : "#f59e0b" }}>{stock.vol}</span>
                            </div>
                            <div style={{ fontSize: 10, color: "#3d4a5c" }}>{stock.name}</div>
                          </div>
                          <div style={{ textAlign: "right" as const }}>
                            <MiniChart change={stock.change} />
                            <div style={{ fontSize: 12, color: stock.change >= 0 ? "#34d399" : "#f87171", fontWeight: 500 }}>{stock.change >= 0 ? "+" : ""}{stock.change}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {myDrafted.length === 5 && (
                    <button className="btn-gold" style={{ width: "100%", marginTop: 16 }} onClick={() => setScreen("lineup")}>Draft Complete → Set Lineup</button>
                  )}
                </div>
              )}

              {screen === "lineup" && (
                <div style={{ maxWidth: 600 }}>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Set Lineup</h2>
                    <div style={{ fontSize: 11, color: "#3d4a5c" }}>Assign picks to slots · Set your conviction</div>
                  </div>
                  {myDrafted.length === 0 && (
                    <div className="card" style={{ textAlign: "center", padding: 32 }}>
                      <div style={{ fontSize: 11, color: "#3d4a5c", marginBottom: 16 }}>No stocks drafted yet</div>
                      <button className="btn-ghost" onClick={() => setScreen("draft")}>← Go to Draft</button>
                    </div>
                  )}
                  {SLOT_CONFIG.map(slot => {
                    const stock = lineup[slot.id];
                    const isActive = activeSlot === slot.id;
                    const score = calcScore(slot.id);
                    return (
                      <div key={slot.id} className={`slot-card ${stock ? "filled" : ""} ${isActive ? "active-slot" : ""}`}
                        onClick={() => !stock && setActiveSlot(isActive ? null : slot.id)}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ fontSize: 22 }}>{slot.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: slot.color }}>{slot.label}</span>
                              <span style={{ fontSize: 9, color: "#2a3550" }}>{slot.mult}x</span>
                            </div>
                            {!stock && <div style={{ fontSize: 10, color: "#2a3550" }}>{slot.desc}</div>}
                            {stock && (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: slot.color }}>{stock.ticker}</span>
                                <span style={{ fontSize: 11, color: stock.change >= 0 ? "#34d399" : "#f87171" }}>{stock.change >= 0 ? "+" : ""}{stock.change}%</span>
                                <span style={{ marginLeft: "auto", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: score >= 0 ? "#34d399" : "#f87171" }}>{score >= 0 ? "+" : ""}{score} pts</span>
                              </div>
                            )}
                          </div>
                          {stock && (
                            <button onClick={e => { e.stopPropagation(); setLineup(prev => { const n = { ...prev }; delete n[slot.id]; return n; }); }}
                              style={{ background: "none", border: "none", color: "#2a3550", cursor: "pointer", fontSize: 18 }}>×</button>
                          )}
                        </div>
                        {stock && (
                          <div onClick={e => e.stopPropagation()} style={{ marginTop: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 10, color: "#3d4a5c" }}>Conviction:</span>
                              <ConvictionDots value={convictions[slot.id] || 1} onChange={v => setConvictions(prev => ({ ...prev, [slot.id]: v }))} />
                            </div>
                          </div>
                        )}
                        {isActive && !stock && (
                          <div style={{ marginTop: 12, borderTop: "1px solid #1e2433", paddingTop: 12 }}>
                            {myDrafted.filter(s => !Object.values(lineup).find(l => l?.ticker === s.ticker)).map(s => (
                              <div key={s.ticker} onClick={e => { e.stopPropagation(); assignToSlot(s, slot.id); }}
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer", borderBottom: "1px solid #080c14" }}>
                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: sectorColors[s.sector] || "#64748b", width: 52 }}>{s.ticker}</span>
                                <span style={{ flex: 1, fontSize: 11, color: "#3d4a5c" }}>{s.name}</span>
                                <span style={{ fontSize: 12, color: s.change >= 0 ? "#34d399" : "#f87171" }}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {Object.keys(lineup).length === 5 && (
                    <button className="btn-gold" style={{ width: "100%", marginTop: 8 }} onClick={() => setScreen("matchup")}>Lock Lineup → View Matchup</button>
                  )}
                </div>
              )}

              {screen === "matchup" && (
                <div style={{ maxWidth: 600 }}>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Live Matchup</h2>
                    <div style={{ fontSize: 11, color: "#3d4a5c" }}>Week 1 · {activeLeague?.name}</div>
                  </div>
                  <div className="card" style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#f59e0b" }}>{totalScore}</div>
                        <div style={{ fontSize: 11, color: "#3d4a5c" }}>{userName}</div>
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#2a3550", fontWeight: 800 }}>VS</div>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#3d4a5c" }}>1,890</div>
                        <div style={{ fontSize: 11, color: "#3d4a5c" }}>Opponent</div>
                      </div>
                    </div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${Math.min(100, (totalScore / (totalScore + 1890)) * 100)}%`, background: "#f59e0b" }} />
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: totalScore > 1890 ? "#34d399" : "#f87171", fontWeight: 600 }}>
                      {totalScore > 1890 ? `▲ Leading by ${totalScore - 1890} pts` : `▼ Trailing by ${1890 - totalScore} pts`}
                    </div>
                  </div>
                  {SLOT_CONFIG.map((slot, i) => {
                    const myStock = lineup[slot.id];
                    const oppStocks = [{ ticker: "AMZN", change: 0.9 }, { ticker: "MSFT", change: 1.1 }, { ticker: "AAPL", change: 0.6 }, { ticker: "RIVN", change: -3.4 }, { ticker: "JNJ", change: 0.2 }];
                    const oppStock = oppStocks[i];
                    const myScore = calcScore(slot.id);
                    const oppScore = Math.round(oppStock.change * slot.mult * 100);
                    return (
                      <div key={slot.id} className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", padding: "14px 16px", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: slot.color }}>{myStock?.ticker || "—"}</div>
                          <div style={{ fontSize: 10, color: myScore >= 0 ? "#34d399" : "#f87171" }}>{myScore >= 0 ? "+" : ""}{myScore} pts</div>
                        </div>
                        <div style={{ textAlign: "center" as const, fontSize: 18 }}>{slot.icon}</div>
                        <div style={{ textAlign: "right" as const }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#3d4a5c" }}>{oppStock.ticker}</div>
                          <div style={{ fontSize: 10, color: oppScore >= 0 ? "#34d399" : "#f87171" }}>{oppScore >= 0 ? "+" : ""}{oppScore} pts</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreateLeague && (
        <div className="modal-overlay" onClick={() => { setShowCreateLeague(false); setLeagueError(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create League</div>
            {leagueError && <div className="error-text">{leagueError}</div>}
            <input className="input" placeholder="League name..." value={leagueName} onChange={e => setLeagueName(e.target.value)} />
            <div className="toggle-row">
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Public League</div>
                <div style={{ fontSize: 10, color: "#3d4a5c" }}>Anyone can find and join</div>
              </div>
              <button className={`toggle ${isPublic ? "on" : ""}`} onClick={() => setIsPublic(!isPublic)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={createLeague}>Create</button>
              <button className="btn-ghost" onClick={() => { setShowCreateLeague(false); setLeagueError(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showJoinLeague && (
        <div className="modal-overlay" onClick={() => { setShowJoinLeague(false); setLeagueError(""); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Join League</div>
            {leagueError && <div className="error-text">{leagueError}</div>}
            <input className="input" placeholder="INVITE CODE" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 800, textAlign: "center" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={() => joinLeague(undefined, joinCode)}>Join</button>
              <button className="btn-ghost" onClick={() => { setShowJoinLeague(false); setLeagueError(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showScheduleDraft && (
        <div className="modal-overlay" onClick={() => setShowScheduleDraft(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Schedule Draft</div>
            <div style={{ fontSize: 11, color: "#3d4a5c", marginBottom: 16 }}>Set the date and time. All members will see a live countdown.</div>
            <div style={{ fontSize: 10, color: "#3d4a5c", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Date</div>
            <input className="input" type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            <div style={{ fontSize: 10, color: "#3d4a5c", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Time</div>
            <input className="input" type="time" value={draftTime} onChange={e => setDraftTime(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={scheduleDraft}>Set Draft Time</button>
              <button className="btn-ghost" onClick={() => setShowScheduleDraft(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}