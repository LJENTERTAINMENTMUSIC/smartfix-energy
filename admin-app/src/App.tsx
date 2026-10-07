import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Database, Eye, EyeOff, Loader2, Lock, LogOut, Mail, ShieldCheck, TriangleAlert,
} from "lucide-react";
import Admin from "./Admin";
import { supabase, supabaseConfigured } from "./lib/supabase";
import { SMARTFIX_CONTACT } from "@shared/contact";

const LOCAL_MODE_KEY = "smartfix_admin_local_mode";

type Phase = "loading" | "login" | "ready" | "setup";

/* ------------------------------------------------------------------ */
/*  Brand mark (self-contained — no dependency on the public site)     */
/* ------------------------------------------------------------------ */

function AdminLogo() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl glass-panel glow-green flex items-center justify-center">
        <ShieldCheck className="w-7 h-7 text-[var(--energy-green)]" />
      </div>
      <div>
        <div className="font-display font-bold text-2xl tracking-tight">
          <span className="text-gradient-light">SmartFix </span>
          <span className="text-gradient-green">Energy</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-2 glass-panel rounded-full px-3.5 py-1.5">
          <Lock className="w-3 h-3 text-[var(--cng-blue)]" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--muted-foreground)]">
            ADMIN CONSOLE
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Login screen (Supabase email + password)                           */
/* ------------------------------------------------------------------ */

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError(error.message);
    // Successful sign-in flips the app phase via onAuthStateChange in App.
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 md:p-10 reveal">
        <AdminLogo />

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartfixinnovative.com"
                className="w-full rounded-xl bg-[var(--graphite)] border border-[var(--border)] pl-10 pr-3 py-2.5 text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--energy-green)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                id="login-password"
                name="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-[var(--graphite)] border border-[var(--border)] pl-10 pr-11 py-2.5 text-sm text-[var(--electric)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--energy-green)]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--electric)]"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.25)] px-3.5 py-3 text-xs text-[#ff6b61]">
              <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="press-scale w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold bg-[var(--energy-green)] text-[var(--obsidian)] disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-[11px] text-center text-[var(--muted-foreground)]">
          Authorized personnel only · {SMARTFIX_CONTACT.website}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Setup screen (Supabase env vars missing)                           */
/* ------------------------------------------------------------------ */

function SetupScreen({ onLocalMode }: { onLocalMode: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-card p-8 md:p-10 reveal">
        <AdminLogo />

        <div className="mt-8 flex items-start gap-3 rounded-xl bg-[rgba(255,149,0,0.08)] border border-[rgba(255,149,0,0.25)] px-4 py-3.5">
          <Database className="w-4 h-4 text-[#ff9500] shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-[#ffb340]">
            Database not connected yet. Add your Supabase credentials to{" "}
            <code className="px-1 py-0.5 rounded bg-black/30">admin-app/.env</code> to enable secure
            sign-in and live data sync.
          </p>
        </div>

        <ol className="mt-6 space-y-3 text-xs text-[var(--muted-foreground)] list-none">
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full glass-panel flex items-center justify-center text-[10px] font-bold text-[var(--energy-green)]">1</span>
            Create a free project at supabase.com
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full glass-panel flex items-center justify-center text-[10px] font-bold text-[var(--energy-green)]">2</span>
            Copy the Project URL and anon public key from Settings → API
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full glass-panel flex items-center justify-center text-[10px] font-bold text-[var(--energy-green)]">3</span>
            Paste them into <code className="px-1 py-0.5 rounded bg-black/30">.env</code> as{" "}
            <code className="px-1 py-0.5 rounded bg-black/30">VITE_SUPABASE_URL</code> and{" "}
            <code className="px-1 py-0.5 rounded bg-black/30">VITE_SUPABASE_ANON_KEY</code>, then restart
          </li>
        </ol>

        <button
          onClick={onLocalMode}
          className="press-scale mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium glass-panel border border-[var(--border)] text-[var(--electric)]"
        >
          <Lock className="w-4 h-4 text-[var(--cng-blue)]" />
          Continue in local mode (this browser only)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setPhase(sessionStorage.getItem(LOCAL_MODE_KEY) === "1" ? "ready" : "setup");
      return;
    }
    let cancelled = false;
    supabase.auth.getSession().then(({ data }: any) => {
      if (!cancelled) setPhase(data.session ? "ready" : "login");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setPhase(session ? "ready" : "login");
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const enterLocalMode = () => {
    sessionStorage.setItem(LOCAL_MODE_KEY, "1");
    setPhase("ready");
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setPhase("login");
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--energy-green)]" />
      </div>
    );
  }

  if (phase === "setup") return <SetupScreen onLocalMode={enterLocalMode} />;
  if (phase === "login") return <LoginScreen />;

  return (
    <>
      {!supabaseConfigured && (
        <div className="sticky top-0 z-40 bg-[rgba(255,149,0,0.1)] border-b border-[rgba(255,149,0,0.25)] px-4 py-2 text-center text-[11px] text-[#ffb340]">
          Local mode — data saves to this browser only. Connect Supabase to sync with the live site.
        </div>
      )}
      <Admin onSignOut={supabaseConfigured ? signOut : undefined} />
    </>
  );
}
