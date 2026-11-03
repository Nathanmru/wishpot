import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-sm pt-16 text-center">
      <p className="font-display text-6xl">404</p>
      <Link href="/" className="btn-ghost mt-8">←</Link>
    </div>
  );
}
