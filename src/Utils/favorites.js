import { db } from "./db";

export const addToFavDB = async (fav, f) => {
  try {
    if (f instanceof Array) {
      console.log(f);
      fav.Files = [...fav.Files, ...f];
      await fav.addFiles(f);
    } else {
      fav.Files.push(f);
      await fav.addFiles([f]);
    }
  } catch (err) {
    console.log(err);
  }
};

export const createFav = async (Name) => {
  return await db.Favorite.create({ Name, Type: "Files" }, { include: "Files" });
};

export const getFavoritesDB = async () => {
  let favs = [];

  try {
    favs = await db.Favorite.findAll({ where: { Type: "Files" }, include: "Files" });
    if (favs.length === 0) {
      const fav = await createFav("default");
      fav.Files = [];
      favs.push(fav);
    }
  } catch (error) {
    console.log(error);
  }

  return favs;
};
