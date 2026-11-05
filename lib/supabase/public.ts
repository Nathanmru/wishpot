import { createClient as create } from "@supabase/supabase-js";

/** Lecture publique du catalogue, sans session : pour les pages vues par Google. */
export function publicClient() {
  return create(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
