-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "beers" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING,
    "abv" FLOAT8,
    "ibu" INT4,
    "srm" INT4,
    "upc" INT4,
    "descript" STRING,
    "brewery_id" INT4,
    "cat_id" INT4,
    "style_id" INT4,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breweries" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "name" STRING,
    "address1" STRING,
    "address2" STRING,
    "city" STRING,
    "state" STRING,
    "code" STRING,
    "country" STRING,
    "phone" STRING,
    "website" STRING,
    "filepath" STRING,
    "descript" STRING,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "breweries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "cat_name" STRING,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "styles" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "style_name" STRING,
    "cat_id" INT4 NOT NULL,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "hash" STRING NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersBeersLikes" (
    "userId" INT4 NOT NULL,
    "beerId" INT4 NOT NULL,

    CONSTRAINT "UsersBeersLikes_pkey" PRIMARY KEY ("userId","beerId")
);

-- CreateTable
CREATE TABLE "UsersBeersRatings" (
    "userId" INT4 NOT NULL,
    "beerId" INT4 NOT NULL,
    "rating" INT4 NOT NULL,

    CONSTRAINT "UsersBeersRatings_pkey" PRIMARY KEY ("userId","beerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users__pgroll_new_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "beers" ADD CONSTRAINT "brewery_id_link" FOREIGN KEY ("brewery_id") REFERENCES "breweries"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beers" ADD CONSTRAINT "cat_id_link" FOREIGN KEY ("cat_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beers" ADD CONSTRAINT "style_id_link" FOREIGN KEY ("style_id") REFERENCES "styles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "styles" ADD CONSTRAINT "cat_id_link" FOREIGN KEY ("cat_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsersBeersLikes" ADD CONSTRAINT "UsersBeersLikes_beerId_fkey" FOREIGN KEY ("beerId") REFERENCES "beers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBeersLikes" ADD CONSTRAINT "UsersBeersLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBeersRatings" ADD CONSTRAINT "UsersBeersRatings_beerId_fkey" FOREIGN KEY ("beerId") REFERENCES "beers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBeersRatings" ADD CONSTRAINT "UsersBeersRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
