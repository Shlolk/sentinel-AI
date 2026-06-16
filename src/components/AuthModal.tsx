import { useState, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

type Mode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-[420px] mx-4 rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-2xl px-8 py-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <span className="material-symbols-outlined text-[20px] text-white">shield</span>
          </div>
          <div className="leading-none">
            <div className="font-headline-md text-[22px] tracking-[0.06em] text-white">SENTINEL</div>
          </div>
        </div>

        <div className="flex mb-8 rounded-lg border border-white/8 bg-white/4 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "login"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}
            onClick={() => setMode("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "signup"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" ? <LoginForm onSuccess={onSuccess} /> : <SignUpForm onSuccess={onSuccess} />}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const email = emailRef.current?.value.trim();
    const password = passRef.current?.value;
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim() || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Email</label>
        <input
          ref={emailRef}
          type="email"
          placeholder="name@company.com"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/25"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Password</label>
        <input
          ref={passRef}
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/25"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-white/40 cursor-pointer">
          <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-white" />
          Remember me
        </label>
        <a href="#" className="text-white/40 hover:text-white/60 transition-colors">Forgot password?</a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passRef.current?.value;
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      onSuccess();
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim() || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Full Name</label>
        <input
          ref={nameRef}
          type="text"
          placeholder="Jane Doe"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/25"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Email</label>
        <input
          ref={emailRef}
          type="email"
          placeholder="name@company.com"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/25"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Password</label>
        <input
          ref={passRef}
          type="password"
          placeholder="Create a password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/25"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>
      <p className="text-center text-[11px] text-white/30">
        By signing up you agree to our{" "}
        <a href="#" className="underline hover:text-white/50">Terms</a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-white/50">Privacy Policy</a>
      </p>
    </form>
  );
}
