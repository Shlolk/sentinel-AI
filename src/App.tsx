import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255,42,42,0.08), transparent 36%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
          backgroundPosition: "center top, center top, center top",
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(255,42,42,0.07),_transparent_24%)]" />

      <Navbar />

      <main className="relative z-10 flex min-h-screen flex-col items-center">
        <Hero />

        <section className="w-full border-t border-white/8 bg-[#070707]">
          <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-label-sm text-[11px] uppercase tracking-[0.28em] text-white/55">
                <span className="h-2 w-2 rounded-full bg-[#FF2A2A] shadow-[0_0_18px_#FF2A2A]" />
                Platform overview
              </div>
              <h2 className="mt-5 font-headline-md text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.95] tracking-[0.04em] text-white">
                Built to keep the next section of your strategy grounded.
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/45">
                Sentinel AI separates signal from noise, so teams can move from intuition to
                evidence without losing speed.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Decision clarity",
                  body: "Turn complex assumptions into a shared executive view with priority signals and clear ownership.",
                },
                {
                  title: "Risk containment",
                  body: "Catch drift early with live monitoring that keeps critical assumptions visible before they fail.",
                },
                {
                  title: "Audit readiness",
                  body: "Keep a clean trail for leadership, legal, and compliance reviews without extra process overhead.",
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-2xl"
                >
                  <div className="font-headline-md text-[2rem] tracking-[0.04em] text-white">
                    {card.title}
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-white/48">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
