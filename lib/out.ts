/** Lien sortant vers la boutique d'une pièce du catalogue : passe par /go pour compter le clic et appliquer l'affiliation. */
export const out = (id: number | string) => `/go?p=${id}`;
