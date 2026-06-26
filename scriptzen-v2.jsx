import { useState } from "react";

// ─── DEMO USERS (real app mein backend hoga) ─────────────────────
const DEMO_USERS = {
  "admin@scriptzen.com": { password: "admin123", plan: "business", name: "Admin" },
  "pro@scriptzen.com":   { password: "pro123",   plan: "pro",      name: "Pro User" },
  "test@scriptzen.com":  { password: "test123",  plan: "free",     name: "Test User" },
};

// ─── PLAN CONFIG ─────────────────────────────────────────────────
const PLANS = {
  free: {
    name: "Free", price: "$0", period: "", badge: null, color: "#444",
    features: [
      { text: "3 scripts per day", ok: true },
      { text: "5 basic themes only", ok: true },
      { text: "60s duration max", ok: true },
      { text: "Copy script", ok: false },
      { text: "Custom topic", ok: false },
      { text: "All moods & themes", ok: false },
      { text: "Download script (.txt)", ok: false },
      { text: "Priority AI generation", ok: false },
    ],
    scriptLimit: 3, durationLimit: ["30 seconds", "60 seconds"], themeLimit: 5,
  },
  pro: {
    name: "Pro", price: "$9.99", period: "/month", badge: "MOST POPULAR", color: "#7c3aed",
    features: [
      { text: "Unlimited scripts", ok: true },
      { text: "All themes + custom topic", ok: true },
      { text: "All durations (30s–3min)", ok: true },
      { text: "Copy & Download script", ok: true },
      { text: "All moods & vibes", ok: true },
      { text: "Priority AI generation", ok: true },
      { text: "Commercial use license", ok: false },
      { text: "Multiple users", ok: false },
    ],
    scriptLimit: Infinity, durationLimit: null, themeLimit: Infinity,
  },
  business: {
    name: "Business", price: "$29.99", period: "/month", badge: null, color: "#e879f9",
    features: [
      { text: "Everything in Pro", ok: true },
      { text: "Commercial use license", ok: true },
      { text: "Multiple users (5 seats)", ok: true },
      { text: "Priority support", ok: true },
      { text: "Early access to features", ok: true },
      { text: "Custom branding", ok: true },
      { text: "API access", ok: true },
      { text: "Dedicated account manager", ok: true },
    ],
    scriptLimit: Infinity, durationLimit: null, themeLimit: Infinity,
  },
};

const MOODS = ["🔥 Epic / Intense","💪 Motivational","😔 Dark / Emotional","⚡ Hype / Fast-paced","🌙 Calm / Reflective"];
const ALL_THEMES = ["Never Give Up","Student Life Struggle","Glow Up / Change","Lonely but Strong","Dream Big","Rise After Failure","Silent Grind","Pain Into Power","Custom (apna topic)"];
const FREE_THEMES = ALL_THEMES.slice(0, 5);
const DURATIONS = ["30 seconds","60 seconds","90 seconds","3 minutes"];

// ─── STYLES ──────────────────────────────────────────────────────
const S = {
  app: { minHeight: "100vh", background: "#080810", color: "#f0f0f0", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: "1px solid #1a1a2e", background: "#09090f", position: "sticky", top: 0, zIndex: 100 },
  navLogo: { fontSize: "18px", fontWeight: "900", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "1px", cursor: "pointer" },
  navRight: { display: "flex", gap: "10px", alignItems: "center" },
  // AUTH
  authWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center, #120820 0%, #080810 70%)", padding: "20px" },
  authCard: { background: "#0f0f1a", border: "1px solid #2a2a40", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px" },
  authLogo: { textAlign: "center", fontSize: "28px", fontWeight: "900", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "6px" },
  authTagline: { textAlign: "center", color: "#555", fontSize: "13px", marginBottom: "32px" },
  authTab: { display: "flex", background: "#080810", borderRadius: "10px", padding: "4px", marginBottom: "28px" },
  authTabBtn: { flex: 1, padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" },
  authTabActive: { background: "#7c3aed", color: "#fff" },
  authTabInactive: { background: "transparent", color: "#555" },
  fieldWrap: { marginBottom: "16px" },
  fieldLabel: { display: "block", color: "#a78bfa", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" },
  input: { width: "100%", background: "#080810", border: "1px solid #2a2a40", borderRadius: "8px", color: "#f0f0f0", padding: "13px 16px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  btnPrimary: { padding: "14px 28px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", width: "100%", letterSpacing: "1px", boxShadow: "0 4px 20px rgba(124,58,237,0.35)", transition: "all 0.2s" },
  btnGhost: { padding: "14px 28px", background: "transparent", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#666", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%", transition: "all 0.2s" },
  btnOutline: { padding: "8px 18px", background: "transparent", border: "1px solid #7c3aed", borderRadius: "8px", color: "#7c3aed", fontSize: "13px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", transition: "all 0.2s" },
  btnSmall: { padding: "6px 14px", background: "transparent", border: "1px solid #2a2a3a", borderRadius: "6px", color: "#666", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" },
  dividerRow: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#1a1a2e" },
  dividerText: { color: "#444", fontSize: "12px" },
  demoBox: { background: "#0a0a18", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "14px", marginTop: "16px" },
  demoTitle: { color: "#555", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" },
  demoUser: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", transition: "background 0.15s", marginBottom: "4px" },
  // HERO
  hero: { textAlign: "center", padding: "60px 20px 40px", background: "radial-gradient(ellipse at top, #1a0520 0%, #080810 60%)" },
  heroEye: { fontSize: "11px", letterSpacing: "4px", color: "#7c3aed", textTransform: "uppercase", marginBottom: "16px" },
  heroTitle: { fontSize: "clamp(28px,5vw,52px)", fontWeight: "900", lineHeight: 1.1, marginBottom: "16px", color: "#fff" },
  heroSub: { color: "#888", fontSize: "16px", maxWidth: "480px", margin: "0 auto 32px" },
  heroStats: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" },
  statNum: { fontSize: "28px", fontWeight: "900", color: "#7c3aed" },
  statLabel: { fontSize: "11px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" },
  // PLANS
  plansSection: { padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" },
  plansTitle: { textAlign: "center", fontSize: "13px", letterSpacing: "3px", color: "#7c3aed", textTransform: "uppercase", marginBottom: "8px" },
  plansSub: { textAlign: "center", fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "40px" },
  plansGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  planCard: { background: "#0f0f1a", border: "1px solid #1e1e35", borderRadius: "16px", padding: "28px", position: "relative" },
  planCardPro: { border: "1px solid #7c3aed", background: "linear-gradient(160deg, #12082a 0%, #0f0f1a 50%)" },
  planBadge: { position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#7c3aed", color: "#fff", fontSize: "10px", fontWeight: "800", letterSpacing: "2px", padding: "4px 14px", borderRadius: "20px" },
  planName: { fontSize: "14px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" },
  planPrice: { fontSize: "40px", fontWeight: "900", color: "#fff", lineHeight: 1 },
  planPeriod: { fontSize: "14px", color: "#666", fontWeight: "400" },
  planFeature: { display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", fontSize: "14px", borderBottom: "1px solid #111120" },
  checkOk: { color: "#7c3aed", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
  checkNo: { color: "#2a2a3a", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
  // APP
  appWrap: { maxWidth: "800px", margin: "0 auto", padding: "32px 20px" },
  card: { background: "#0f0f1a", border: "1px solid #1e1e30", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
  label: { display: "block", color: "#a78bfa", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" },
  select: { width: "100%", background: "#080810", border: "1px solid #2a2a40", borderRadius: "8px", color: "#f0f0f0", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  moodBtn: { padding: "8px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", transition: "all 0.2s", fontWeight: "600" },
  sceneCard: { background: "#080810", border: "1px solid #1a1a28", borderLeft: "3px solid #7c3aed", borderRadius: "8px", padding: "16px", marginBottom: "12px" },
  sceneNum: { color: "#7c3aed", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" },
  sLabel: { color: "#a78bfa", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  sText: { color: "#ccc", fontSize: "14px", lineHeight: 1.6 },
  hookBox: { fontSize: "18px", fontWeight: "800", color: "#fff", lineHeight: 1.4, padding: "16px", background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "8px", marginBottom: "12px" },
  tag: { display: "inline-block", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "4px", color: "#a78bfa", fontSize: "11px", padding: "3px 8px", marginRight: "6px", marginBottom: "6px", fontWeight: "600" },
  hr: { border: "none", borderTop: "1px solid #1a1a28", margin: "20px 0" },
  loader: { textAlign: "center", padding: "40px", color: "#7c3aed" },
  dot: { display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#7c3aed", margin: "0 4px" },
  error: { background: "rgba(255,50,50,0.08)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: "8px", color: "#ff6666", padding: "12px 16px", fontSize: "13px", marginBottom: "14px" },
  success: { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "8px", color: "#a78bfa", padding: "12px 16px", fontSize: "13px", marginBottom: "14px" },
  lockBox: { textAlign: "center", padding: "28px 20px", background: "rgba(8,8,16,0.85)", borderRadius: "12px", border: "1px solid #1e1e30", marginTop: "20px" },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" },
  modal: { background: "#0f0f1a", border: "1px solid #2a2a40", borderRadius: "16px", padding: "32px", maxWidth: "420px", width: "100%" },
  planBannerBadge: { fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px" },
};

// ─── MAIN ────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | login | app
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null); // { email, name, plan }
  const [plan, setPlan] = useState("free");

  // Auth fields
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass]   = useState("");
  const [authName, setAuthName]   = useState("");
  const [authErr, setAuthErr]     = useState("");
  const [authMsg, setAuthMsg]     = useState("");
  const [showPass, setShowPass]   = useState(false);

  // Generator
  const [theme, setTheme]           = useState(ALL_THEMES[0]);
  const [customTheme, setCustomTheme] = useState("");
  const [mood, setMood]             = useState(MOODS[1]);
  const [duration, setDuration]     = useState("60 seconds");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [genErr, setGenErr]         = useState("");
  const [copied, setCopied]         = useState("");
  const [scriptsToday, setScriptsToday] = useState(0);

  // Modals
  const [showUpgrade, setShowUpgrade]   = useState(false);
  const [showPayModal, setShowPayModal] = useState(null);

  const currentPlan = PLANS[plan];
  const themes   = plan === "free" ? FREE_THEMES : ALL_THEMES;
  const finalTopic = theme === "Custom (apna topic)" ? customTheme : theme;

  // ── AUTH HANDLERS ─────────────────────────────────────────────
  const handleLogin = () => {
    setAuthErr(""); setAuthMsg("");
    const found = DEMO_USERS[authEmail.trim().toLowerCase()];
    if (!found) { setAuthErr("Email nahi mili. Demo accounts neeche dekho."); return; }
    if (found.password !== authPass) { setAuthErr("Password galat hai!"); return; }
    setUser({ email: authEmail, name: found.name, plan: found.plan });
    setPlan(found.plan);
    setScriptsToday(0);
    setScreen("app");
  };

  const handleSignup = () => {
    setAuthErr(""); setAuthMsg("");
    if (!authName.trim()) { setAuthErr("Naam likho!"); return; }
    if (!authEmail.includes("@")) { setAuthErr("Valid email likho!"); return; }
    if (authPass.length < 6) { setAuthErr("Password kam se kam 6 characters ka hona chahiye!"); return; }
    // Demo: auto-register as free user
    setUser({ email: authEmail, name: authName, plan: "free" });
    setPlan("free");
    setScriptsToday(0);
    setScreen("app");
  };

  const handleLogout = () => {
    setUser(null); setPlan("free"); setResult(null);
    setScreen("landing"); setAuthEmail(""); setAuthPass(""); setAuthName("");
  };

  const fillDemo = (email, pass) => {
    setAuthEmail(email); setAuthPass(pass); setAuthErr(""); setAuthMsg("");
  };

  // ── GENERATOR ────────────────────────────────────────────────
  const canGenerate = () => !(plan === "free" && scriptsToday >= 3);

  const generate = async () => {
    if (!canGenerate()) { setShowUpgrade(true); return; }
    if (!finalTopic.trim()) { setGenErr("Theme ya topic select karo!"); return; }
    setGenErr(""); setResult(null); setLoading(true);
    const sec = duration.includes("30") ? "30" : duration.includes("60") ? "60" : duration.includes("90") ? "90" : "180";
    const words = sec==="30"?"75-90":sec==="60"?"150-180":sec==="90"?"220-260":"450-500";
    const scenes = sec==="30"?"3":sec==="60"?"5":sec==="90"?"7":"12";
    const prompt = `You are an expert anime motivational YouTube Shorts script writer.
Topic: "${finalTopic}", Mood: ${mood}, Duration: ${sec}s (${words} words), Scenes: ${scenes}
Return ONLY valid JSON (no markdown):
{"hook":"2-second attention grabber","title":"YouTube title <60 chars","hashtags":["t1","t2","t3","t4","t5"],"scenes":[{"scene":1,"duration":"5s","voiceover":"narrator text","onScreen":"short punchy text","visual":"anime clip vibe"}],"callToAction":"final CTA"}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]}),
      });
      const data = await res.json();
      const txt = data.content?.map(i=>i.text||"").join("")||"";
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
      setScriptsToday(s=>s+1);
    } catch(e) { setGenErr("Error aaya: "+e.message); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    if (plan==="free") { setShowUpgrade(true); return; }
    if (!result) return;
    const t = [`TITLE: ${result.title}`,`HOOK: ${result.hook}`,"---",
      ...result.scenes.map(s=>`SCENE ${s.scene} (${s.duration})\nVO: ${s.voiceover}\nON SCREEN: ${s.onScreen}\nVISUAL: ${s.visual}`),
      `CTA: ${result.callToAction}`,`HASHTAGS: ${result.hashtags?.map(h=>"#"+h).join(" ")}`].join("\n\n");
    navigator.clipboard.writeText(t);
    setCopied("all"); setTimeout(()=>setCopied(""),2000);
  };

  const downloadTxt = () => {
    if (plan==="free") { setShowUpgrade(true); return; }
    if (!result) return;
    const t = [`TITLE: ${result.title}`,`HOOK: ${result.hook}`,"",
      ...result.scenes.map(s=>`SCENE ${s.scene} (${s.duration})\nVO: ${s.voiceover}\nON SCREEN: ${s.onScreen}\nVISUAL: ${s.visual}\n`),
      `CTA: ${result.callToAction}`,`HASHTAGS: ${result.hashtags?.map(h=>"#"+h).join(" ")}`].join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([t],{type:"text/plain"}));
    a.download=`scriptzen-${Date.now()}.txt`; a.click();
  };

  const activatePlan = (p) => {
    setPlan(p);
    if (user) setUser({...user, plan: p});
    setShowPayModal(null); setShowUpgrade(false); setScriptsToday(0);
  };

  // ════════════════════════════════════════════════════════════════
  // LANDING PAGE
  // ════════════════════════════════════════════════════════════════
  if (screen === "landing") return (
    <div style={S.app}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} button:hover{opacity:.88;transform:translateY(-1px)} @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
      <nav style={S.nav}>
        <div style={S.navLogo}>🧘 ScriptZen</div>
        <div style={S.navRight}>
          <button style={{...S.btnSmall,color:"#888"}} onClick={()=>{setAuthTab("login");setScreen("login")}}>Login</button>
          <button style={{...S.btnOutline,padding:"8px 20px"}} onClick={()=>{setAuthTab("signup");setScreen("login")}}>Sign Up Free</button>
        </div>
      </nav>
      <div style={S.hero}>
        <div style={S.heroEye}>AI-Powered Anime Script Generator</div>
        <h1 style={S.heroTitle}>
          Create Viral Anime<br/>
          <span style={{background:"linear-gradient(90deg,#7c3aed,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Shorts Scripts</span><br/>
          in Seconds
        </h1>
        <p style={S.heroSub}>Professional anime scripts — zero effort, maximum impact. CapCut mein paste karo. Upload karo. Viral ho jao.</p>
        <button style={{...S.btnPrimary,width:"auto",padding:"16px 48px",fontSize:"16px",marginBottom:"40px"}} onClick={()=>{setAuthTab("signup");setScreen("login")}}>
          ✨ Start For Free
        </button>
        <div style={S.heroStats}>
          {[["10K+","Scripts"],["500+","Creators"],["4.9★","Rating"],["#1","Anime AI"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={S.statNum}>{n}</div>
              <div style={S.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.plansSection}>
        <div style={S.plansTitle}>Pricing</div>
        <div style={S.plansSub}>Choose Your Plan</div>
        <div style={S.plansGrid}>
          {Object.entries(PLANS).map(([key,p])=>(
            <div key={key} style={{...S.planCard,...(key==="pro"?S.planCardPro:{})}}>
              {p.badge&&<div style={S.planBadge}>{p.badge}</div>}
              <div style={{...S.planName,color:p.color}}>{p.name}</div>
              <div style={{marginBottom:"24px"}}>
                <span style={S.planPrice}>{p.price}</span>
                <span style={S.planPeriod}>{p.period}</span>
              </div>
              <div style={{marginBottom:"24px"}}>
                {p.features.map((f,i)=>(
                  <div key={i} style={{...S.planFeature,color:f.ok?"#e0e0e0":"#3a3a4a"}}>
                    <span style={f.ok?S.checkOk:S.checkNo}>{f.ok?"✓":"✕"}</span>{f.text}
                  </div>
                ))}
              </div>
              <button style={key==="free"?S.btnGhost:S.btnPrimary}
                onClick={()=>{setAuthTab(key==="free"?"signup":"signup");setScreen("login")}}>
                {key==="free"?"Start Free":`Get ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // LOGIN / SIGNUP PAGE
  // ════════════════════════════════════════════════════════════════
  if (screen === "login") return (
    <div style={{...S.app,...S.authWrap}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input:focus{border-color:#7c3aed!important;outline:none} button:hover{opacity:.88}`}</style>
      <div style={S.authCard}>
        <div style={S.authLogo}>🧘 ScriptZen</div>
        <div style={S.authTagline}>Anime Motivational Script Generator</div>

        {/* Tabs */}
        <div style={S.authTab}>
          <button style={{...S.authTabBtn,...(authTab==="login"?S.authTabActive:S.authTabInactive)}} onClick={()=>{setAuthTab("login");setAuthErr("");setAuthMsg("")}}>Login</button>
          <button style={{...S.authTabBtn,...(authTab==="signup"?S.authTabActive:S.authTabInactive)}} onClick={()=>{setAuthTab("signup");setAuthErr("");setAuthMsg("")}}>Sign Up</button>
        </div>

        {authErr && <div style={S.error}>⚠️ {authErr}</div>}
        {authMsg && <div style={S.success}>✅ {authMsg}</div>}

        {authTab==="signup"&&(
          <div style={S.fieldWrap}>
            <label style={S.fieldLabel}>👤 Naam</label>
            <input style={S.input} placeholder="Tumhara naam" value={authName} onChange={e=>setAuthName(e.target.value)}/>
          </div>
        )}

        <div style={S.fieldWrap}>
          <label style={S.fieldLabel}>📧 Email</label>
          <input style={S.input} type="email" placeholder="email@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/>
        </div>

        <div style={{...S.fieldWrap,marginBottom:"24px"}}>
          <label style={S.fieldLabel}>🔒 Password</label>
          <div style={{position:"relative"}}>
            <input style={{...S.input,paddingRight:"50px"}} type={showPass?"text":"password"} placeholder="••••••••" value={authPass} onChange={e=>setAuthPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&(authTab==="login"?handleLogin():handleSignup())}/>
            <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#555",cursor:"pointer",fontSize:"16px"}}>
              {showPass?"🙈":"👁"}
            </button>
          </div>
        </div>

        <button style={{...S.btnPrimary,marginBottom:"12px"}} onClick={authTab==="login"?handleLogin:handleSignup}>
          {authTab==="login"?"🔐 Login":"✨ Create Free Account"}
        </button>
        <button style={S.btnGhost} onClick={()=>setScreen("landing")}>← Back</button>

        {/* Demo accounts */}
        <div style={S.demoBox}>
          <div style={S.demoTitle}>🧪 Demo Accounts</div>
          {[
            {email:"admin@scriptzen.com",pass:"admin123",plan:"Business",color:"#e879f9"},
            {email:"pro@scriptzen.com",  pass:"pro123",  plan:"Pro",     color:"#7c3aed"},
            {email:"test@scriptzen.com", pass:"test123", plan:"Free",    color:"#555"},
          ].map(d=>(
            <div key={d.email} style={S.demoUser} onClick={()=>fillDemo(d.email,d.pass)}
              onMouseEnter={e=>e.currentTarget.style.background="#111120"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div>
                <div style={{fontSize:"13px",color:"#ccc"}}>{d.email}</div>
                <div style={{fontSize:"11px",color:"#555"}}>{d.pass}</div>
              </div>
              <span style={{fontSize:"11px",fontWeight:"700",color:d.color,border:`1px solid ${d.color}40`,padding:"2px 8px",borderRadius:"10px"}}>{d.plan}</span>
            </div>
          ))}
          <div style={{fontSize:"11px",color:"#444",marginTop:"8px"}}>👆 Click karo auto-fill ke liye</div>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // MAIN APP
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={S.app}>
      <style>{`*{box-sizing:border-box} input:focus,select:focus{border-color:#7c3aed!important;outline:none} button:hover{opacity:.88} @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>

      <nav style={S.nav}>
        <div style={S.navLogo} onClick={()=>setScreen("landing")}>🧘 ScriptZen</div>
        <div style={S.navRight}>
          <span style={{fontSize:"13px",color:"#555"}}>
            {plan==="free"?`${3-scriptsToday} left today`:"Unlimited"}
          </span>
          <div style={{...S.planBannerBadge,
            background:plan==="free"?"#111120":plan==="pro"?"rgba(124,58,237,0.15)":"rgba(232,121,249,0.15)",
            color:plan==="free"?"#555":plan==="pro"?"#7c3aed":"#e879f9",
            border:`1px solid ${plan==="free"?"#222":plan==="pro"?"#7c3aed":"#e879f9"}`}}>
            {plan.toUpperCase()}
          </div>
          {user&&<span style={{fontSize:"13px",color:"#666"}}>👤 {user.name}</span>}
          {plan==="free"&&<button style={{...S.btnOutline,padding:"7px 14px",fontSize:"12px"}} onClick={()=>setShowUpgrade(true)}>↑ Upgrade</button>}
          <button style={{...S.btnSmall,color:"#555"}} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={S.appWrap}>
        <div style={S.card}>
          <div style={S.grid2}>
            <div>
              <label style={S.label}>🎯 Theme</label>
              <select style={S.select} value={theme} onChange={e=>setTheme(e.target.value)}>
                {themes.map(t=><option key={t}>{t}</option>)}
                {plan==="free"&&<option disabled>── Pro only ──</option>}
              </select>
            </div>
            <div>
              <label style={S.label}>⏱ Duration</label>
              <select style={S.select} value={duration} onChange={e=>{
                if(plan==="free"&&!PLANS.free.durationLimit.includes(e.target.value)){setShowUpgrade(true);return;}
                setDuration(e.target.value);
              }}>
                {DURATIONS.map(d=>(
                  <option key={d} value={d} disabled={plan==="free"&&!PLANS.free.durationLimit.includes(d)}>
                    {d}{plan==="free"&&!PLANS.free.durationLimit.includes(d)?" 🔒":""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {theme==="Custom (apna topic)"&&(
            <div style={{marginBottom:"16px"}}>
              <label style={S.label}>✍️ Apna Topic</label>
              <input style={S.input} placeholder="e.g. Raat ko akele padhne wala student..." value={customTheme} onChange={e=>setCustomTheme(e.target.value)}/>
            </div>
          )}

          <div style={{marginBottom:"16px"}}>
            <label style={S.label}>🎭 Mood</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {MOODS.map(m=>(
                <button key={m} onClick={()=>setMood(m)} style={{...S.moodBtn,
                  background:mood===m?"rgba(124,58,237,0.15)":"transparent",
                  border:`1px solid ${mood===m?"#7c3aed":"#2a2a3a"}`,
                  color:mood===m?"#a78bfa":"#555"}}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {genErr&&<div style={S.error}>⚠️ {genErr}</div>}

          <button style={{...S.btnPrimary,opacity:loading?.6:1,cursor:loading?"not-allowed":"pointer"}} onClick={generate} disabled={loading}>
            {loading?"Generating...":plan==="free"&&scriptsToday>=3?"🔒 Limit Reached":"✨ Generate Script"}
          </button>

          {plan==="free"&&(
            <div style={{textAlign:"center",marginTop:"10px",color:"#444",fontSize:"12px"}}>
              {scriptsToday}/3 scripts used • <span style={{color:"#7c3aed",cursor:"pointer"}} onClick={()=>setShowUpgrade(true)}>Upgrade for unlimited</span>
            </div>
          )}
        </div>

        {loading&&(
          <div style={S.loader}>
            {[0,.2,.4].map((d,i)=><span key={i} style={{...S.dot,animationDelay:`${d}s`,animation:"pulse 1.2s infinite"}}/>)}
            <p style={{color:"#444",marginTop:"14px",fontSize:"13px"}}>AI script likh raha hai...</p>
          </div>
        )}

        {result&&(
          <div style={S.card}>
            <div style={{marginBottom:"16px"}}>
              <div style={S.label}>📹 Title</div>
              <div style={{fontSize:"18px",fontWeight:"800",color:"#fff",marginBottom:"10px"}}>{result.title}</div>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <span style={S.tag}>⏱ {duration}</span>
                <span style={S.tag}>{mood}</span>
                <span style={S.tag}>🎬 {result.scenes?.length} scenes</span>
              </div>
            </div>

            <div style={S.label}>🎣 Hook</div>
            <div style={S.hookBox}>"{result.hook}"</div>
            <hr style={S.hr}/>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div style={S.label}>🎬 Scenes</div>
              <div style={{display:"flex",gap:"8px"}}>
                <button style={S.btnSmall} onClick={downloadTxt}>{plan==="free"?"🔒 Download":"⬇ Download"}</button>
                <button style={S.btnSmall} onClick={copyAll}>{plan==="free"?"🔒 Copy All":copied==="all"?"✅ Copied!":"📋 Copy All"}</button>
              </div>
            </div>

            {result.scenes?.map((sc,i)=>(
              <div key={i} style={S.sceneCard}>
                <div style={S.sceneNum}>Scene {sc.scene} • {sc.duration}</div>
                <div style={{marginBottom:"8px"}}><div style={S.sLabel}>🎙 Voiceover</div><div style={S.sText}>{sc.voiceover}</div></div>
                <div style={{marginBottom:"8px"}}><div style={S.sLabel}>📝 On Screen</div><div style={{...S.sText,fontWeight:"700",color:"#a78bfa"}}>{sc.onScreen}</div></div>
                <div><div style={S.sLabel}>🎥 Visual</div><div style={{...S.sText,color:"#555",fontStyle:"italic"}}>{sc.visual}</div></div>
              </div>
            ))}

            <hr style={S.hr}/>
            <div style={S.label}>📢 Call to Action</div>
            <div style={{color:"#ccc",fontSize:"14px",marginBottom:"16px"}}>{result.callToAction}</div>
            <div style={S.label}>🏷 Hashtags</div>
            <div>{result.hashtags?.map((h,i)=><span key={i} style={S.tag}>#{h}</span>)}</div>

            {plan==="free"&&(
              <div style={S.lockBox}>
                <div style={{fontSize:"36px",marginBottom:"10px"}}>🔒</div>
                <div style={{fontSize:"16px",fontWeight:"700",color:"#fff",marginBottom:"6px"}}>Copy & Download locked</div>
                <div style={{color:"#555",fontSize:"13px",marginBottom:"16px"}}>Pro plan pe upgrade karo</div>
                <button style={{...S.btnPrimary,width:"auto",padding:"12px 28px"}} onClick={()=>setShowUpgrade(true)}>↑ Upgrade to Pro — $9.99/mo</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UPGRADE MODAL */}
      {showUpgrade&&(
        <div style={S.modalBg} onClick={()=>setShowUpgrade(false)}>
          <div style={{...S.modal,maxWidth:"500px"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"22px",fontWeight:"800",color:"#fff",marginBottom:"6px"}}>↑ Upgrade Plan</div>
            <div style={{color:"#555",fontSize:"14px",marginBottom:"20px"}}>More scripts, all features</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"16px"}}>
              {["pro","business"].map(key=>{
                const p=PLANS[key];
                return(
                  <div key={key} style={{...S.planCard,padding:"20px",border:`1px solid ${p.color}40`}}>
                    <div style={{...S.planName,color:p.color,fontSize:"12px"}}>{p.name}</div>
                    <div style={{fontSize:"26px",fontWeight:"900",color:"#fff"}}>{p.price}<span style={{fontSize:"12px",color:"#555"}}>{p.period}</span></div>
                    <div style={{fontSize:"12px",color:"#555",margin:"8px 0 12px"}}>{key==="pro"?"Unlimited + all features":"Everything + commercial"}</div>
                    <button style={{...S.btnPrimary,padding:"10px",fontSize:"13px",background:key==="pro"?"linear-gradient(135deg,#7c3aed,#6d28d9)":"linear-gradient(135deg,#9333ea,#e879f9)"}}
                      onClick={()=>{setShowPayModal(key);setShowUpgrade(false);}}>Get {p.name}</button>
                  </div>
                );
              })}
            </div>
            <button style={S.btnGhost} onClick={()=>setShowUpgrade(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {/* PAY MODAL */}
      {showPayModal&&(
        <div style={S.modalBg} onClick={()=>setShowPayModal(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"22px",fontWeight:"800",color:"#fff",marginBottom:"6px"}}>🔐 {PLANS[showPayModal].name} Plan</div>
            <div style={{color:"#555",fontSize:"14px",marginBottom:"20px"}}>{PLANS[showPayModal].price}{PLANS[showPayModal].period} • Stripe coming soon</div>
            <div style={{background:"#080810",border:"1px solid #1a1a2e",borderRadius:"10px",padding:"16px",marginBottom:"20px"}}>
              <div style={{color:"#555",fontSize:"12px",marginBottom:"10px"}}>📧 Email</div>
              <input style={{...S.input,marginBottom:"8px"}} placeholder={user?.email||"tumhara@email.com"} defaultValue={user?.email}/>
              <div style={{color:"#333",fontSize:"12px"}}>💳 Stripe integration jald aa raha hai</div>
            </div>
            <button style={{...S.btnPrimary,marginBottom:"10px"}} onClick={()=>activatePlan(showPayModal)}>✅ Activate {PLANS[showPayModal].name} (Demo)</button>
            <button style={S.btnGhost} onClick={()=>setShowPayModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
