-- Atelier Nama v7 : que des pépites. On met de côté les grandes enseignes et les petits riens.
update products set active = false where shop in ('IKEA', 'Maisons du Monde', 'Kave Home');
update products set active = false where active and price < 20;
update products set active = false where active and price > 8000;
update products set active = false where active and shop = 'Fleux' and category in ('deco', 'vaisselle', 'textiles', 'plantes') and price < 40;
update products set active = false where active and wp_norm(title) ~ '\m(mug|gamelle|ornement|essoreuse|saliere|poivriere|porte cuillere|sous verres|sous verre)\M';
