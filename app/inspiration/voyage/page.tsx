import { redirect } from "next/navigation";

/** Wishpot se consacre désormais à la maison : l'ancienne page voyage renvoie aux tendances déco. */
export default function TravelInspiration() {
  redirect("/inspiration/maison");
}
