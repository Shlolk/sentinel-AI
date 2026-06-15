const links = [
  { label: "Trust Center", href: "#" },
  { label: "Partnerships", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Security", href: "#" },
  { label: "Status", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/6 bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl lg:flex-row lg:items-center">
          <div>
            <div className="font-headline-md text-[2.6rem] tracking-[0.06em] text-white">
              SENTINEL
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/48">
              Executive-grade intelligence to keep strategic decisions grounded, monitored, and
              defensible.
            </p>
          </div>

          <a
            href="#"
            className="crimson-glow-hover inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-label-md text-label-md font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
          >
            Contact sales
            <span className="material-symbols-outlined text-[18px]">north_east</span>
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-label-md text-[13px] uppercase tracking-[0.2em] text-white/46 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/6 pt-6 text-center text-[12px] uppercase tracking-[0.18em] text-white/30 lg:flex-row lg:text-left">
          <span>© 2024 Sentinel AI</span>
          <span>Enterprise intelligence platform</span>
        </div>
      </div>
    </footer>
  );
}
