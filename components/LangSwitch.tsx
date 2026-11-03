"use client";

import { useTransition } from "react";
import { setLang } from "@/app/actions";

export default function LangSwitch({ lang, label }: { lang: "fr" | "en"; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => setLang(lang === "fr" ? "en" : "fr"))}
      className="rounded-full px-3 py-1.5 text-muted hover:bg-white"
      aria-label={label}
    >
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
}
