/** Le nom de la maison. */
export const APP_NAME = "Atelier Nama";

/** Adresse de contact affichée sur le site. */
export const CONTACT_EMAIL = "contact.ateliernama@gmail.com";

/** L'adresse officielle du site (celle que Google doit retenir). */
export const CANONICAL_URL = "https://ateliernama.fr";

export function siteUrl() {
  if (process.env.VERCEL_ENV === "production") return CANONICAL_URL;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null;
  return (process.env.NEXT_PUBLIC_SITE_URL || prod || "http://localhost:3000").replace(/\/$/, "");
}

export type Kind = "travel" | "home";

export type Project = {
  id: string;
  name: string;
  kind: Kind;
  currency: string;
  invite_token: string;
  share_token?: string | null;
  created_by: string;
  created_at: string;
};

export type Item = {
  id: string;
  project_id: string;
  added_by: string | null;
  url: string | null;
  title: string;
  image_url: string | null;
  price: number;
  quantity: number;
  category: string | null;
  purchased: boolean;
  room?: string | null;
  reserved_by?: string | null;
  reserved_at?: string | null;
  created_at: string;
};

export type Member = {
  user_id: string;
  role: "owner" | "member";
  monthly_amount: number;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

export type Deposit = {
  id: string;
  user_id: string;
  amount: number;
  note: string | null;
  deposited_on: string;
};
