export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Wishpot";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export type Kind = "travel" | "home";

export type Project = {
  id: string;
  name: string;
  kind: Kind;
  currency: string;
  invite_token: string;
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
