export default function Logo({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`font-display text-[1.65rem] uppercase leading-none tracking-[0.14em] ${className}`}>
      {name}
    </span>
  );
}
