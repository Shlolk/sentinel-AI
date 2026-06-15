import { useEffect, useState } from "react";

const navLinks = [
  { label: "Assumption Intel", href: "#" },
  { label: "Domain Intelligence", href: "#" },
  { label: "Real-Time Signals", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-[100] mx-auto flex w-[calc(100%-1.5rem)] items-center justify-between border border-white/10 bg-black/45 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-500 sm:w-[calc(100%-2rem)] lg:w-[min(1280px,calc(100%-4rem))] ${
        scrolled ? "mt-2 rounded-2xl bg-black/85" : "mt-4 rounded-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <span className="material-symbols-outlined text-[20px] text-white">shield</span>
        </div>
        <div className="leading-none">
          <div className="font-headline-md text-[28px] tracking-[0.06em] text-on-surface">SENTINEL</div>
          <div className="font-label-sm text-[11px] uppercase tracking-[0.28em] text-white/35">
            AI Intelligence
          </div>
        </div>
      </div>

      <nav className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 px-2 py-1 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-full px-4 py-2 font-label-md text-label-md text-white/58 transition-colors hover:bg-white/6 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden rounded-full border border-white/10 px-4 py-2 font-label-md text-label-md text-white/65 transition-colors hover:border-white/20 hover:text-white sm:inline-flex">
          Login
        </button>
        <button className="crimson-glow-hover inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-label-md text-label-md font-semibold text-black transition-transform duration-300 hover:scale-[1.03]">
          Request Demo
          <span className="material-symbols-outlined text-[18px]">north_east</span>
        </button>
      </div>
    </header>
  );
}
