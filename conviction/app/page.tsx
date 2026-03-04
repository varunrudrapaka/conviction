"use client";

import { supabase } from "./supabase";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error) {
      if (error.code === "23505") {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    html, body { background: #080c14; overflow-x: hidden; }

    .landing { min-height: 100vh; background: #080c14; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; }

    /* NAV */
    .nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 48px; border-bottom: 1px solid #1e2433; position: sticky; top: 0; background: #080c14ee; backdrop-filter: blur(12px); z-index: 100; }
    .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }
    .nav-logo span { color: #f59e0b; }
    .nav-links { display: flex; gap: 32px; align-items: center; }
    .nav-link { font-size: 11px; color: #3d4a5c; text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; }
    .nav-link:hover { color: #64748b; }
    .nav-cta { background: #f59e0b; color: #080c14; padding: 10px 20px; border-radius: 6px; font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: pointer; transition: background 0.2s; }
    .nav-cta:hover { background: #fbbf24; }

    /* HERO */
    .hero { padding: 120px 48px 100px; max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .hero-eyebrow { font-size: 10px; letter-spacing: 0.3em; color: #f59e0b; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
    .hero-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: #f59e0b; }
    .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(48px, 6vw, 76px); font-weight: 800; line-height: 1; letter-spacing: -0.03em; margin-bottom: 24px; }
    .hero-title span { color: #f59e0b; }
    .hero-sub { font-size: 13px; color: #3d4a5c; line-height: 1.8; margin-bottom: 48px; max-width: 420px; }
    .hero-sub strong { color: #64748b; font-weight: 500; }

    /* WAITLIST */
    .waitlist-box { display: flex; gap: 0; max-width: 440px; }
    .waitlist-input { flex: 1; background: #0d1117; border: 1px solid #1e2433; border-right: none; border-radius: 8px 0 0 8px; padding: 14px 18px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 12px; outline: none; transition: border-color 0.2s; }
    .waitlist-input:focus { border-color: #f59e0b44; }
    .waitlist-input::placeholder { color: #2a3550; }
    .waitlist-btn { background: #f59e0b; color: #080c14; border: none; padding: 14px 24px; border-radius: 0 8px 8px 0; font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
    .waitlist-btn:hover { background: #fbbf24; }
    .waitlist-btn:disabled { background: #1e2433; color: #3d4a5c; cursor: not-allowed; }
    .waitlist-success { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #34d39918; border: 1px solid #34d39933; border-radius: 8px; max-width: 440px; }
    .waitlist-success-text { font-size: 12px; color: #34d399; }
    .waitlist-count { font-size: 11px; color: #3d4a5c; margin-top: 12px; }
    .waitlist-count span { color: #f59e0b; }

    /* MOCK PHONE */
    .phone-wrap { position: relative; display: flex; justify-content: center; }
    .phone { width: 280px; background: #0d1117; border: 1px solid #1e2433; border-radius: 36px; padding: 16px; box-shadow: 0 40px 80px #000a, 0 0 0 1px #1e2433; position: relative; overflow: hidden; }
    .phone::before { content: ''; position: absolute; top: -60px; left: -60px; width: 200px; height: 200px; background: radial-gradient(circle, #f59e0b18 0%, transparent 70%); pointer-events: none; }
    .phone-notch { width: 80px; height: 6px; background: #1e2433; border-radius: 3px; margin: 0 auto 20px; }
    .phone-screen { background: #080c14; border-radius: 24px; padding: 20px 16px; }

    /* PHONE UI ELEMENTS */
    .p-header { margin-bottom: 20px; }
    .p-eyebrow { font-size: 8px; letter-spacing: 0.2em; color: #f59e0b; text-transform: uppercase; margin-bottom: 6px; }
    .p-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
    .p-title span { color: #f59e0b; }
    .p-card { background: #0d1117; border: 1px solid #1e2433; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .p-card-row { display: flex; justify-content: space-between; align-items: center; }
    .p-ticker { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: #4a9eff; }
    .p-slot { font-size: 8px; color: #3d4a5c; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
    .p-pct-up { font-size: 12px; color: #34d399; font-weight: 600; }
    .p-pct-down { font-size: 12px; color: #f87171; font-weight: 600; }
    .p-dots { display: flex; gap: 4px; margin-top: 8px; }
    .p-dot { width: 10px; height: 10px; border-radius: 50%; }
    .p-score-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid #1e2433; margin-top: 10px; }
    .p-score-label { font-size: 9px; color: #3d4a5c; letter-spacing: 0.1em; }
    .p-score-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #f59e0b; }

    /* TICKER TAPE */
    .ticker-wrap { overflow: hidden; border-top: 1px solid #1e2433; border-bottom: 1px solid #1e2433; background: #0d1117; padding: 10px 0; }
    .ticker-inner { display: inline-flex; gap: 0; animation: ticker 20s linear infinite; white-space: nowrap; }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .ticker-item { padding: 0 28px; font-size: 11px; border-right: 1px solid #1e2433; }

    /* HOW IT WORKS */
    .section { padding: 100px 48px; max-width: 1100px; margin: 0 auto; }
    .section-eyebrow { font-size: 10px; letter-spacing: 0.3em; color: #f59e0b; text-transform: uppercase; margin-bottom: 16px; }
    .section-title { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 60px; line-height: 1.1; }
    .section-title span { color: #f59e0b; }
    .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .step { padding: 28px 24px; background: #0d1117; border: 1px solid #1e2433; border-radius: 16px; position: relative; transition: border-color 0.2s; }
    .step:hover { border-color: #2a3550; }
    .step-num { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: #1e2433; line-height: 1; margin-bottom: 16px; }
    .step-icon { font-size: 28px; margin-bottom: 12px; }
    .step-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 8px; color: #e2e8f0; }
    .step-desc { font-size: 11px; color: "#3d4a5c"; line-height: 1.7; color: #3d4a5c; }

    /* DIFFERENTIATORS */
    .diff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .diff-card { padding: 32px; background: #0d1117; border: 1px solid #1e2433; border-radius: 16px; transition: all 0.2s; }
    .diff-card:hover { border-color: #2a3550; transform: translateY(-2px); }
    .diff-icon { font-size: 32px; margin-bottom: 16px; }
    .diff-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 8px; color: #e2e8f0; }
    .diff-desc { font-size: 11px; color: #3d4a5c; line-height: 1.8; }
    .diff-tag { display: inline-block; margin-top: 12px; padding: 3px 10px; border-radius: 20px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; background: #f59e0b18; color: #f59e0b; }

    /* VS SECTION */
    .vs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; border-radius: 16px; overflow: hidden; border: 1px solid #1e2433; }
    .vs-col { padding: 32px; }
    .vs-col.them { background: #0d1117; }
    .vs-col.us { background: #0a1628; border-left: 1px solid #1e2d4a; }
    .vs-header { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; margin-bottom: 24px; }
    .vs-header.them { color: #3d4a5c; }
    .vs-header.us { color: #f59e0b; }
    .vs-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px; font-size: 11px; line-height: 1.5; }
    .vs-x { color: #f87171; flex-shrink: 0; }
    .vs-check { color: #34d399; flex-shrink: 0; }
    .vs-text-them { color: #3d4a5c; }
    .vs-text-us { color: #94a3b8; }

    /* FOOTER CTA */
    .footer-cta { padding: 100px 48px; text-align: center; border-top: 1px solid #1e2433; }
    .footer-cta-title { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
    .footer-cta-title span { color: #f59e0b; }
    .footer-cta-sub { font-size: 12px; color: #3d4a5c; margin-bottom: 40px; }
    .footer { padding: 24px 48px; border-top: 1px solid #1e2433; display: flex; justify-content: space-between; align-items: center; }
    .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; }
    .footer-logo span { color: #f59e0b; }
    .footer-copy { font-size: 10px; color: #1e2433; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .nav { padding: 16px 20px; }
      .nav-links { display: none; }
      .hero { grid-template-columns: 1fr; padding: 60px 20px 40px; gap: 48px; }
      .phone-wrap { display: none; }
      .section { padding: 60px 20px; }
      .steps { grid-template-columns: 1fr 1fr; }
      .diff-grid { grid-template-columns: 1fr; }
      .vs-grid { grid-template-columns: 1fr; }
      .footer-cta { padding: 60px 20px; }
      .footer-cta-title { font-size: 32px; }
      .footer { padding: 20px; flex-direction: column; gap: 8px; }
    }
  `;

  const tickerItems = [
    { ticker: "NVDA", change: "+2.4%", up: true },
    { ticker: "TSLA", change: "-1.8%", up: false },
    { ticker: "AAPL", change: "+0.6%", up: true },
    { ticker: "META", change: "+3.2%", up: true },
    { ticker: "COIN", change: "+4.8%", up: true },
    { ticker: "RIVN", change: "-3.4%", up: false },
    { ticker: "AMD", change: "+1.7%", up: true },
    { ticker: "PYPL", change: "-2.1%", up: false },
    { ticker: "SPOT", change: "+2.6%", up: true },
    { ticker: "PLTR", change: "+5.1%", up: true },
  ];

  return (
    <div className="landing">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">CONVIC<span>TION</span></div>
        <div className="nav-links">
          <a className="nav-link" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>How it works</a>
          <a className="nav-link" onClick={() => document.getElementById("why")?.scrollIntoView({ behavior: "smooth" })}>Why us</a>
          <a className="nav-link" onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>Join waitlist</a>
        </div>
        <button className="nav-cta" onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}>
          Join Waitlist
        </button>
      </nav>

      {/* TICKER TAPE */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item" style={{ color: item.up ? "#34d399" : "#f87171" }}>
              {item.ticker} {item.change}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Fantasy stocks. Real skill.</div>
          <h1 className="hero-title">
            Back your<br />picks or<br /><span>don't bother.</span>
          </h1>
          <p className="hero-sub">
            <strong>Conviction</strong> is a weekly fantasy stock league where your thesis is on the line.
            Draft real stocks, assign them to roster slots, stake your confidence — and let the market decide who actually knows what they're doing.
          </p>

          <div id="waitlist">
            {!submitted ? (
              <>
                <div className="waitlist-box">
                  <input
                    className="waitlist-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                  <button className="waitlist-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "..." : "Join Waitlist"}
                  </button>
                </div>
                <div className="waitlist-count"><span>247 people</span> already on the waitlist</div>
              </>
            ) : (
              <div className="waitlist-success">
                <span style={{ fontSize: 20 }}>✓</span>
                <div>
                  <div className="waitlist-success-text">You&apos;re on the list.</div>
                  <div style={{ fontSize: 10, color: "#1e4a38", marginTop: 2 }}>We&apos;ll email you when your league spot opens.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOCK PHONE */}
        <div className="phone-wrap">
          <div className="phone">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="p-header">
                <div className="p-eyebrow">Week 7 · Your Lineup</div>
                <div className="p-title">CONVIC<span>TION</span></div>
              </div>

              {[
                { ticker: "NVDA", slot: "⚓ Anchor", change: "+2.4%", up: true, color: "#4a9eff", dots: [1,1,1,1,0] },
                { ticker: "META", slot: "📈 Swing Play", change: "+3.2%", up: true, color: "#a78bfa", dots: [1,1,1,0,0] },
                { ticker: "COIN", slot: "🚀 Moon Shot", change: "+4.8%", up: true, color: "#f59e0b", dots: [1,1,1,1,1] },
                { ticker: "RIVN", slot: "🛡️ Hedge", change: "-3.4%", up: false, color: "#34d399", dots: [1,1,0,0,0] },
              ].map(stock => (
                <div key={stock.ticker} className="p-card">
                  <div className="p-card-row">
                    <div>
                      <div className="p-ticker" style={{ color: stock.color }}>{stock.ticker}</div>
                      <div className="p-slot">{stock.slot}</div>
                    </div>
                    <div className={stock.up ? "p-pct-up" : "p-pct-down"}>{stock.change}</div>
                  </div>
                  <div className="p-dots">
                    {stock.dots.map((on, i) => (
                      <div key={i} className="p-dot" style={{ background: on ? "#f59e0b" : "#1e2433", boxShadow: on ? "0 0 6px #f59e0b66" : "none" }} />
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-score-row">
                <div className="p-score-label">YOUR SCORE</div>
                <div className="p-score-val">2,140</div>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 60, background: "#f59e0b22", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how">
        <div className="section">
          <div className="section-eyebrow">The game</div>
          <h2 className="section-title">How it <span>works</span></h2>
          <div className="steps">
            {[
              { num: "01", icon: "📋", title: "Draft your stocks", desc: "Join a live snake draft with your league. Once a stock is taken, it's off the board. No two players can hold the same pick." },
              { num: "02", icon: "💼", title: "Build your roster", desc: "Assign picks to slots — Anchor, Swing Play, Moon Shot, Hedge. Each slot has a different score multiplier." },
              { num: "03", icon: "🎯", title: "Stake your conviction", desc: "Rate your confidence 1–5x on each pick. High conviction + correct call = massive score. Overconfidence costs you." },
              { num: "04", icon: "⚔️", title: "Win your matchup", desc: "Go head-to-head against one opponent each week. Stock performance + conviction = your final score." },
            ].map(step => (
              <div key={step.num} className="step">
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CONVICTION */}
      <div id="why" style={{ background: "#0d1117", borderTop: "1px solid #1e2433", borderBottom: "1px solid #1e2433" }}>
        <div className="section">
          <div className="section-eyebrow">Why us</div>
          <h2 className="section-title">Built for people who<br />actually <span>have a thesis</span></h2>
          <div className="diff-grid">
            {[
              { icon: "🎯", title: "Conviction Staking", desc: "Every pick requires a confidence multiplier. A 5x conviction on a correct call scores huge. Being wrong at 5x costs you big. Luck doesn't scale — reasoning does.", tag: "Core differentiator" },
              { icon: "📋", title: "Live Snake Draft", desc: "Before each week, your league drafts from a shared pool. If someone takes NVIDIA, it's gone. Real strategy, real FOMO, real competitive tension.", tag: "Fantasy sports mechanic" },
              { icon: "💼", title: "Roster Positions", desc: "Not just a portfolio — a lineup. Anchor, Swing, Moon Shot, Hedge. Forces actual portfolio thinking instead of picking your five favorite tickers.", tag: "Skill builder" },
              { icon: "🧬", title: "Investor DNA", desc: "After 8+ weeks you get a profile: accuracy by sector, conviction calibration, slot win rates. A data-backed identity that gets sharper the longer you play.", tag: "Long-term retention" },
            ].map(d => (
              <div key={d.title} className="diff-card">
                <div className="diff-icon">{d.icon}</div>
                <div className="diff-title">{d.title}</div>
                <div className="diff-desc">{d.desc}</div>
                <div className="diff-tag">{d.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VS SECTION */}
      <div className="section">
        <div className="section-eyebrow">Comparison</div>
        <h2 className="section-title">Not just another<br /><span>paper trading app</span></h2>
        <div className="vs-grid">
          <div className="vs-col them">
            <div className="vs-header them">Other apps</div>
            {[
              "Pick stocks, track returns, repeat",
              "Lucky guess = same score as smart pick",
              "No draft — everyone holds the same stocks",
              "No thesis required, no accountability",
              "Leaderboard resets, nothing carries forward",
            ].map(t => (
              <div key={t} className="vs-row">
                <span className="vs-x">✕</span>
                <span className="vs-text-them">{t}</span>
              </div>
            ))}
          </div>
          <div className="vs-col us">
            <div className="vs-header us">Conviction</div>
            {[
              "Draft, roster, conviction — a real game loop",
              "Multipliers reward reasoning, not luck",
              "Snake draft means every lineup is unique",
              "Write your thesis or lose your edge",
              "Investor DNA compounds week over week",
            ].map(t => (
              <div key={t} className="vs-row">
                <span className="vs-check">✓</span>
                <span className="vs-text-us">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="footer-cta">
        <h2 className="footer-cta-title">Ready to back<br />your <span>picks?</span></h2>
        <p className="footer-cta-sub">Join the waitlist. First leagues open soon.</p>
        {!submitted ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="waitlist-box">
              <input
                className="waitlist-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button className="waitlist-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : "Join Waitlist"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="waitlist-success">
              <span style={{ fontSize: 20 }}>✓</span>
              <div className="waitlist-success-text">You&apos;re on the list. We&apos;ll be in touch.</div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">CONVIC<span>TION</span></div>
        <div className="footer-copy">© 2025 Conviction. All rights reserved.</div>
      </footer>
    </div>
  );
}