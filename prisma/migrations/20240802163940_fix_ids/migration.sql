-- AlterSequence
ALTER SEQUENCE "beers_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "breweries_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "categories_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "styles_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "users_id_seq" MAXVALUE 9223372036854775807;

SELECT setval(pg_get_serial_sequence('categories', 'id'), coalesce(max(id)+1, 1), false) FROM categories;
SELECT setval(pg_get_serial_sequence('styles', 'id'), coalesce(max(id)+1, 1), false) FROM styles;
SELECT setval(pg_get_serial_sequence('breweries', 'id'), coalesce(max(id)+1, 1), false) FROM breweries;
SELECT setval(pg_get_serial_sequence('beers', 'id'), coalesce(max(id)+1, 1), false) FROM beers;