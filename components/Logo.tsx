export default function Logo({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 32" className="h-7 w-auto" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2A65A" />
            <stop offset="1" stopColor="#2E3270" />
          </linearGradient>
        </defs>
        <path d="M2 11 A10 10 0 0 1 22 11 V29 a2 2 0 0 1 -2 2 H4 a2 2 0 0 1 -2 -2 Z" fill="#EFE5D9" />
        <path d="M2 17 C7 15 12 19 17 17 S22 16 22 16 V29 a2 2 0 0 1 -2 2 H4 a2 2 0 0 1 -2 -2 Z" fill="url(#logo-g)" />
        <path d="M12 2 V31" stroke="#fff" strokeWidth="1.5" />
      </svg>
      <span className="font-display text-2xl leading-none">{name}</span>
    </span>
  );
}
