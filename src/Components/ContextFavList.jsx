import { useState, useEffect } from "react";
import { addToFavDB, getFavoritesDB } from "../Utils/favorites";

const hasFile = (fav, file) => fav.Files.find((f) => f.Path === file.Path);

const ContextFavList = ({ hide, file, all }) => {
  const [favs, setFavs] = useState([]);

  const addFav = (fav, file) => {
    addToFavDB(fav, file).then(hide);
  };

  useEffect(() => {
    let isMounted = true;
    getFavoritesDB().then((result) => {
      if (isMounted) {
        setFavs(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const favItems = favs.map((e, i) => {
    //check if file is in this favorite list
    if (all || !hasFile(e, file)) {
      return (
        <li key={`fav-${i}-${all}`} onClick={() => addFav(e, file)}>
          {e.Name}
        </li>
      );
    }
  });

  return <ul id="favs">{favItems}</ul>;
};

export default ContextFavList;
