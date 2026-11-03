import type { Kind } from "./config";

// Photos Unsplash (licence gratuite). Remplacer ces adresses pour changer les visuels.
export const COVERS: Record<Kind, string> = {
  home: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1600&q=80",
  travel: "https://images.unsplash.com/photo-1562865582-d6317ab58923?auto=format&fit=crop&w=1600&q=80",
};

export function cover(kind: Kind, width = 1600) {
  return COVERS[kind].replace("w=1600", `w=${width}`);
}

export const KIND_STYLE: Record<Kind, { chip: string; soft: string; text: string; emoji: string }> = {
  home: { chip: "bg-walnut-soft text-walnut", soft: "bg-walnut-soft", text: "text-walnut", emoji: "🛋️" },
  travel: { chip: "bg-dusk-soft text-dusk", soft: "bg-dusk-soft", text: "text-dusk", emoji: "✈️" },
};
