-- Wishpot v4 : qualité du catalogue (classements corrigés, couleurs et styles en anglais)

-- Fleux : « arts de la table » et « linge de lit » avaient été rangés dans tables et lits
update products set active = false where shop = 'Fleux' and wp_norm(title) ~ '\m(gamelle|ornement|fuck)\M';
update products set category = 'textiles', room = 'chambre'
  where shop = 'Fleux' and category = 'lits' and wp_norm(title) ~ '\m(plaid|edredon|couette|drap|housse|coussin|couverture|parure|taie)\M';
update products set category = 'vaisselle', room = 'cuisine'
  where shop = 'Fleux' and category = 'tables'
    and wp_norm(title) ~ '\m(mug|tasse|tasses|assiette|assiettes|bol|bols|verre|verres|carafe|saliere|poivriere|essoreuse|planche|couvert|couverts|theiere|pichet|plat|saladier|cuillere|sous verres)\M';
update products set category = 'deco'
  where shop = 'Fleux' and category = 'tables' and wp_norm(title) !~ '\m(table|tables|console|bureau|gueridon|chevet|desserte)\M';
update products set category = 'deco'
  where shop = 'Fleux' and category = 'lits' and wp_norm(title) !~ '\m(lit|lits|tete)\M';

-- Les marques nordiques nomment leurs produits en anglais
update products set room = 'exterieur' where room <> 'exterieur' and wp_norm(title) ~ '\m(outdoor|garden)\M';

create or replace function wp_style(t text) returns text language plpgsql stable as $$
declare s text := ' ' || wp_norm(t) || ' ';
begin
  if s ~ '\m(cuir|leather|chesterfield|club|vintage|vieilli|aged|patine|retro|chine|brocante|seconde main|annees|suedine|suede|cotele|corduroy)\M' then return 'vintage'; end if;
  if s ~ '\m(rotin|rattan|osier|wicker|cane|jute|macrame|bambou|bamboo|jonc|raphia|raffia|franges|fringe|berbere|kilim|jacinthe|sisal|tresse|tressee|braided|woven|paille|seagrass|boheme)\M' then return 'boheme'; end if;
  if s ~ '\m(dore|doree|laiton|brass|gold|golden|marbre|marble|velours|velvet|arche|arch|globe|nacre|deco|opalin|opal|ambre|amber|chrome)\M' then return 'art-deco'; end if;
  if s ~ '\m(fer|forge|iron|industriel|industrial|atelier|beton|concrete|acier|steel|metal noir|black metal|tubulaire)\M' then return 'industriel'; end if;
  if s ~ '\m(lin|linen|bouclette|bouclettes|bouclee|boucle|travertin|travertine|ceramique|ceramic|gres|stoneware|terre cuite|organique|organic|nuage|papier|paper|washi|japandi|wabi)\M' then return 'naturel'; end if;
  if s ~ '\m(moulure|moulures|capitonne|classique|classic|bistrot|bistro|provence|faience|campagne|vichy|gingham|perle|perlee|chandelier)\M' then return 'classique'; end if;
  if s ~ '\m(chene|oak|bouleau|birch|frene|ash|hetre|beech|pin|pine|scandinave|nordic|hevea|teck|teak)\M' then return 'scandinave'; end if;
  return 'contemporain';
end $$;

create or replace function wp_color(t text) returns text language plpgsql stable as $$
declare s text := ' ' || wp_norm(t) || ' ';
begin
  if s ~ '\m(terracotta|rouille|rust|ocre|ochre|orange|brique|brick|cuivre|copper|cimarron|terre brulee)\M' then return 'terracotta'; end if;
  if s ~ '\m(vert|verte|green|kaki|khaki|sauge|sage|olive|celadon|emeraude|emerald|foret|forest|moss|vetiver)\M' then return 'vert'; end if;
  if s ~ '\m(bleu|bleue|blue|marine|navy|canard|encre|indigo|turquoise)\M' then return 'bleu'; end if;
  if s ~ '\m(rose|roses|pink|blush|corail|coral|poudre|framboise)\M' then return 'rose'; end if;
  if s ~ '\m(jaune|yellow|moutarde|mustard|safran)\M' then return 'jaune'; end if;
  if s ~ '\m(rouge|red|bordeaux|burgundy|cerise|cherry)\M' then return 'rouge'; end if;
  if s ~ '\m(cognac|camel|caramel|marron|brown|brun|chocolat|chocolate|espresso|ganache|mocaccino|tobacco|noyer|walnut|ecureuil|noisette|miel|teck|teak|acacia|manguier|sheesham|cuir|leather|smoked)\M' then return 'brun'; end if;
  if s ~ '\m(dore|doree|laiton|brass|or|gold|golden|champagne|ambre|amber)\M' then return 'dore'; end if;
  if s ~ '\m(noir|noire|noirs|black|anthracite|charbon|charcoal)\M' then return 'noir'; end if;
  if s ~ '\m(gris|grise|grey|gray|argent|argente|silver|chrome|aluminium|aluminum|steel)\M' then return 'gris'; end if;
  if s ~ '\m(beige|ecru|ecrue|creme|cream|sable|sand|lin|linen|naturel|natural|ivoire|ivory|chalk|oatmeal|off white|jute|rotin|rattan|osier|wicker|cane|blanc casse|bouclette|bouclettes|amande|taupe)\M' then return 'beige'; end if;
  if s ~ '\m(blanc|blanche|blancs|white|snow)\M' then return 'blanc'; end if;
  if s ~ '\m(chene|oak|bouleau|birch|frene|ash|hetre|beech|pin|pine|bois|wood|wooden|bambou|bamboo|hevea)\M' then return 'bois'; end if;
  return null;
end $$;

update products set color = wp_color(title) where color is null;
update products set style = wp_style(title) where style = 'contemporain';

-- Une colonne de recherche sans accents, avec la marque, le style et la couleur
update products set search = wp_norm(title || ' ' || shop || ' ' || coalesce(style, '') || ' ' || coalesce(color, '') || ' ' || category || ' ' || room);

-- Et on la tient à jour toute seule
create or replace function wp_products_search() returns trigger language plpgsql as $$
begin
  new.search := wp_norm(new.title || ' ' || new.shop || ' ' || coalesce(new.style, '') || ' ' || coalesce(new.color, '') || ' ' || coalesce(new.category, '') || ' ' || coalesce(new.room, ''));
  return new;
end $$;
drop trigger if exists products_search on products;
create trigger products_search before insert or update of title, shop, style, color, category, room on products
  for each row execute function wp_products_search();
