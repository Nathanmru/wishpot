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
    <div className="mt-3 flex flex-wrap gap-2">
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
            className={`rounded-full border px-3 py-1.5 text-sm transition ${done ? "border-sage bg-sage-soft text-sage" : "border-line bg-white hover:border-ink"}`}
          >
            {done ? "✓" : idea.emoji} {label} <span className="text-muted">~{est}</span>
          </button>
        );
      })}
    </div>
  );
}
