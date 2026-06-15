export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#050505] via-[#070707] to-[#0a0a0a]">
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(255,42,42,0.08),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_26%)]" />

      <div className="absolute inset-0 z-[2] pointer-events-none overflow-visible">
        <img
          src="/robo_hand_-removebg-preview.png"
          alt=""
          aria-hidden="true"
          className="hand-grayscale absolute select-none opacity-80 blur-[0.2px]"
          style={{
            left: "50%",
            bottom: "-16%",
            width: "clamp(540px, 58vw, 820px)",
            height: "auto",
            transform: "translate(calc(-101.5% - 10px), 20%) rotate(14deg)",
            transformOrigin: "96.2% 45.5%",
          }}
        />
        <img
          src="/human_hand_-removebg-preview.png"
          alt=""
          aria-hidden="true"
          className="hand-grayscale absolute select-none opacity-80 blur-[0.2px]"
          style={{
            left: "50%",
            bottom: "-8%",
            width: "clamp(560px, 65vw, 860px)",
            height: "auto",
            transform: "translate(calc(2.6% + 10px), 8%) rotate(-14deg)",
            transformOrigin: "2.6% 53.7%",
          }}
        />
      </div>

      <div className="absolute z-[3] pointer-events-none" style={{ left: "50%", top: "68%" }}>
        <div className="relative flex items-center justify-center w-[160px] h-[160px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-[160px] h-[160px] rounded-full border border-white/12 animate-pulse-ring" style={{ boxShadow: "0 0 24px rgba(255,255,255,0.06), inset 0 0 24px rgba(255,255,255,0.03)" }} />
          <div className="absolute w-[112px] h-[112px] rounded-full border border-white/20 animate-pulse-ring" style={{ animationDelay: "0.4s", boxShadow: "0 0 20px rgba(255,255,255,0.10), inset 0 0 20px rgba(255,255,255,0.05)" }} />
          <div className="absolute w-[68px] h-[68px] rounded-full border border-white/28 animate-pulse-ring" style={{ animationDelay: "0.8s", boxShadow: "0 0 16px rgba(255,255,255,0.16), inset 0 0 16px rgba(255,255,255,0.08)" }} />
          <div className="absolute w-[28px] h-[28px] rounded-full bg-white/90" style={{ boxShadow: "0 0 40px rgba(255,255,255,0.35), 0 0 80px rgba(255,255,255,0.12)" }} />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-24 pt-24 lg:px-8">
        <div className="flex flex-1 flex-col justify-start pt-4 md:pt-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-label-sm text-[11px] uppercase tracking-[0.28em] text-white/60">
              <span className="h-2 w-2 rounded-full bg-[#FF2A2A] shadow-[0_0_18px_#FF2A2A]" />
              Enterprise intelligence for high-stakes teams
            </div>

            <h1 className="max-w-[1120px] font-display-lg text-[clamp(3.6rem,8.2vw,6.1rem)] uppercase leading-[0.9] tracking-[-0.04em] liquid-metal-text">
              See risk before it becomes reality.
            </h1>

            <p className="mt-7 max-w-[760px] text-pretty font-body-md text-[16px] leading-[1.85] text-white/48 md:text-[18px]">
              Sentinel AI tracks the assumptions behind your decisions, highlights drift early,
              and keeps leaders aligned with a clean, audit-ready view of what matters.
            </p>

            <button className="crimson-glow-hover mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-8 py-3.5 font-label-md text-label-md font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 hover:border-white/25 hover:bg-white/15 hover:scale-[1.03]">
              Request Demo
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </button>

          </div>

          <div className="mt-12 flex justify-center">
            <div className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/14 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
