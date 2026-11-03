# Wishpot — la cagnotte à plusieurs (voyage & maison)

Site complet : connexion Google, cagnottes partagées par lien, ajout d'objets en collant un lien (nom, photo et prix récupérés automatiquement), budget mensuel par personne, versements, suggestions d'idées et de boutiques, liens affiliés. Français + anglais.

> Le nom « Wishpot » est provisoire : change `NEXT_PUBLIC_APP_NAME` dans les variables d'environnement, tout le site suit.

---

## Mise en ligne (≈ 30 min, gratuit pour démarrer)

Tu as besoin de 3 comptes gratuits : **GitHub**, **Supabase** (base de données + connexion Google), **Vercel** (hébergement).

### 1. Mettre le code sur GitHub
1. Crée un dépôt vide sur github.com (ex. `wishpot`).
2. Dézippe ce dossier, puis glisse-dépose tous les fichiers dans le dépôt (bouton « uploading an existing file »), ou en ligne de commande :
   ```bash
   git init && git add . && git commit -m "v1"
   git remote add origin https://github.com/<toi>/wishpot.git && git push -u origin main
   ```

### 2. Créer la base Supabase
1. supabase.com → **New project** (région : Paris / eu-west-3).
2. Menu **SQL Editor** → colle tout le contenu de `supabase/schema.sql` → **Run**.
3. **Project Settings → API** : note l'**URL** et la clé **anon public**.

### 3. Activer « Continuer avec Google »
1. console.cloud.google.com → nouveau projet → **APIs & Services → OAuth consent screen** (type *External*, nom du site, ton email) → publie-le.
2. **Credentials → Create credentials → OAuth client ID** → type *Web application*.
   - *Authorized redirect URI* : `https://<ton-projet>.supabase.co/auth/v1/callback` (Supabase te l'affiche à l'étape suivante).
3. Copie le **Client ID** et le **Client secret**.
4. Dans Supabase : **Authentication → Providers → Google** → active, colle les deux valeurs.
5. **Authentication → URL Configuration** :
   - *Site URL* : l'adresse finale du site (ex. `https://wishpot.fr`)
   - *Redirect URLs* : ajoute `https://wishpot.fr/**` et `http://localhost:3000/**`

### 4. Héberger sur Vercel
1. vercel.com → **Add New → Project** → importe le dépôt GitHub.
2. Dans **Environment Variables**, ajoute celles de `.env.example` :
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (étape 2)
   - `NEXT_PUBLIC_SITE_URL` = l'adresse du site (ex. `https://wishpot.fr`)
   - `NEXT_PUBLIC_APP_NAME` = le nom choisi
   - les variables d'affiliation (peuvent rester vides au début)
3. **Deploy**. Pour un nom de domaine : **Settings → Domains** (achète-le chez OVH, Gandi… ou directement chez Vercel).
4. Pense à remettre la même adresse dans Supabase (*Site URL*) et dans `NEXT_PUBLIC_SITE_URL`.

### Tester en local (optionnel)
```bash
cp .env.example .env.local   # puis remplis les valeurs
npm install
npm run dev                  # → http://localhost:3000
```

---

## Gagner de l'argent avec l'affiliation

Les clics « Voir ↗ » et les boutiques suggérées passent par `/go`, qui transforme le lien en lien affilié (et compte les clics dans la table `clicks`). Sans identifiant renseigné, le lien original est utilisé.

| Programme | Pour | Variable |
|---|---|---|
| Amazon Partenaires (partenaires.amazon.fr) | électroménager, petits objets | `AMAZON_TAG` |
| Awin (awin.com) | Maisons du Monde, La Redoute, Made in Design… (chaque marchand doit t'accepter) | `AWIN_PUBLISHER_ID` + `AWIN_MERCHANTS` |
| Booking.com Affiliate Partner | hôtels | `BOOKING_AID` |
| GetYourGuide Partner | activités | `GETYOURGUIDE_PARTNER_ID` |

`AWIN_MERCHANTS` = liste `domaine:identifiant-marchand` séparée par des virgules, ex. `maisonsdumonde.com:12345,laredoute.fr:6789` (l'identifiant apparaît dans ton espace Awin une fois accepté).

À savoir : les programmes demandent souvent un site déjà en ligne avec du contenu avant d'accepter ; la mention d'affiliation obligatoire est déjà en bas de chaque page. Pour d'autres marchands (IKEA n'a pas de programme ouvert en France), ajoute une règle dans `lib/affiliate.ts`.

---

## Comment c'est organisé

```
app/
  page.tsx              Accueil (choix Voyage / Maison)
  login/                Connexion Google
  new/                  Création d'une cagnotte (type, nom, budget mensuel)
  dashboard/            Mes cagnottes
  p/[id]/               Page d'une cagnotte : jauge, liste, idées, membres, versements, invitation
  invite/[token]/       Lien d'invitation → connexion → rejoint automatiquement
  api/extract/          Lit une page web et renvoie nom / image / prix
  go/                   Redirection sortante + affiliation
  actions.ts            Toutes les modifications (ajout, suppression, budget…)
lib/
  extract.ts            Extraction du prix (schema.org, Open Graph, microdata)
  affiliate.ts          Règles d'affiliation
  suggestions.ts        Idées et boutiques proposées (voyage / maison) — à enrichir librement
  i18n.ts               Textes FR / EN
supabase/schema.sql     Tables + sécurité (chacun ne voit que ses cagnottes)
```

**Calcul de la cagnotte** : objectif = somme des objets (prix × quantité) ; épargné = somme des versements ; temps estimé = reste ÷ total des parts mensuelles de tous les membres.

**Récupération du prix** : fonctionne sur la plupart des boutiques qui publient leurs données produit (Maisons du Monde, La Redoute, Fnac, Darty, Booking…). Certains gros sites (Amazon notamment) bloquent les lectures automatiques : le nom ou le prix peut alors manquer, et l'utilisateur le complète à la main — c'est prévu dans le formulaire.

## Idées pour la suite
- Notifications (« ta copine a ajouté un canapé »), rappel mensuel de versement
- Vote / priorité sur les objets, catégories par pièce ou par étape du voyage
- Page publique partageable en lecture seule (liste de pendaison de crémaillère)
- Comparateur de prix sur un même objet
