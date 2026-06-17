export default function Icon({ name, className = "" }: { name: string; className?: string }) {
  const s = { fill: "none" as const, stroke: "currentColor" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: "1.7", viewBox: "0 0 24 24" };
  switch (name) {
    case "menu": return <svg className={className} {...s}><path d="M4 6h16M4 12h8m-8 6h16" /></svg>;
    case "search": return <svg className={className} {...s}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case "bell": return <svg className={className} {...s}><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5" /><path d="M9 17a3 3 0 0 0 6 0" /></svg>;
    case "settings": return <svg className={className} {...s}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1 1 0 0 0 .2-1l-.1-.2a1 1 0 0 0-.3-1.1l-1.1-.7a7.9 7.9 0 0 0 0-1.4l1.1-.7a1 1 0 0 0 .3-1.1l.1-.2a1 1 0 0 0-.2-1l-1.3-1.3a1 1 0 0 0-1-.2l-.2.1a1 1 0 0 0-1.1.3l-.7 1.1a7.9 7.9 0 0 0-1.4 0l-.7-1.1a1 1 0 0 0-1.1-.3l-.2-.1a1 1 0 0 0-1 .2L6.6 5.2a1 1 0 0 0-.2 1l.1.2a1 1 0 0 0 .3 1.1l1.1.7a7.9 7.9 0 0 0 0 1.4l-1.1.7a1 1 0 0 0-.3 1.1l-.1.2a1 1 0 0 0 .2 1l1.3 1.3a1 1 0 0 0 1 .2l.2-.1a1 1 0 0 0 1.1-.3l.7-1.1a7.9 7.9 0 0 0 1.4 0l.7 1.1a1 1 0 0 0 1.1.3l.2.1a1 1 0 0 0 1-.2Z" /></svg>;
    case "projects": return <svg className={className} {...s}><path d="M4 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M13 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" /><path d="M4 15a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M13 15a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2Z" /></svg>;
    case "check": return <svg className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
    case "warning": return <svg className={className} {...s}><path d="M12 9v3m0 4h.01" /><path d="M10.3 4.5 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z" /></svg>;
    case "trend": return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 100 30"><path d="M0 25 L20 22 L40 28 L60 15 L80 10 L100 2" strokeWidth="2" /></svg>;
    case "drone": return <svg className={className} {...s}><path d="M12 19l9 2-9-18-9 18 9-2Z" /><path d="M12 19v-8" /></svg>;
    case "money": return <svg className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M15 9c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" /></svg>;
    case "shield": return <svg className={className} {...s}><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "plus": return <svg className={className} {...s}><path d="M12 5v14M5 12h14" /></svg>;
    case "upload": return <svg className={className} {...s}><path d="M12 3v12m0-12 3 3m-3-3-3 3" /><path d="M5 16v3h14v-3" /></svg>;
    case "list": return <svg className={className} {...s}><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>;
    default: return null;
  }
}
