"use client";

import { useState, useTransition } from "react";
import { addItem } from "@/app/actions";
import type { Idea } from "@/lib/suggestions";

export default function IdeaChips({
  projectId,
  ideas,
  lang,
  currency,
}: {
  projectId: string;
  ideas: Idea[];
  lang: "fr" | "en";
  currency: string;
}) {
  const [pending, start] = useTransition();
  const [added, setAdded] = useState<string[]>([]);

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ideas.map((idea) => {
        const label = lang === "en" ? idea.en : idea.fr;
        const done = added.includes(idea.fr);
        const est = new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(
          idea.price * (idea.qty ?? 1)
        );
        return (
          <button
            key={idea.fr}
            type="button"
            disabled={pending || done}
            onClick={() =>
              start(async () => {
                await addItem(projectId, { title: label, price: idea.price, quantity: idea.qty ?? 1, category: idea.category });
                setAdded((a) => [...a, idea.fr]);
              })
            }
            className={`flex items-center gap-3 rounded-xl2 border p-3 text-left transition ${
              done ? "border-moss/40 bg-moss-soft" : "border-line bg-white hover:border-ink/30 hover:shadow-soft"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-xl">{done ? "✓" : idea.emoji}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted">≈ {est}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
