import { useState } from "react";
import { createFav } from "../Utils/favorites";
import { loadFavFromJson, saveToJson, sortByName } from "../Utils/utils";

const FavControl = ({ datas, setDatas }) => {
  const [edit, setEdit] = useState(false);

  const addNew = async () => {
    const newFav = await createFav("New " + datas.favs.length);
    newFav.Files = [];
    datas.favs.push(newFav);
    datas.favs.sort(sortByName);
    datas.current = newFav;
    setDatas({ ...datas });
    setEdit(true);
  };

  const removeFav = async () => {
    if (datas.favs.length > 1) {
      const i = datas.favs.indexOf(datas.current);
      let fav = datas.favs.splice(i, 1)[0];
      if (fav) {
        await fav.destroy();
        datas.current = datas.favs[i > 0 ? i - 1 : 0];
        setDatas({ ...datas });
      }
    }
  };

  const renameFav = async ({ target: { value } }) => {
    datas.current.Name = value;
    datas.current.save();
    setDatas({ ...datas });
  };

  const onBlur = () => setEdit();

  const editEdit = (e) => {
    if (e.keyCode === 13) {
      setEdit();
      e.preventDefault();
    }
  };

  const selectedFav = ({ target: { value } }) => {
    datas.current = datas.favs.find((f) => f.Name === value);
    setDatas({ ...datas });
  };

  const saveFav = () => {
    if (datas.current.Files?.length) {
      saveToJson(datas.current);
    }
  };

  const readFromJson = async () => {
    const result = await loadFavFromJson(datas);
    setDatas(result);
  };

  return (
    <div id="list-control">
      <span onClick={addNew}>
        <i className="fa fa-plus-square" />
      </span>
      <span onClick={setEdit}>
        <i className="fa fa-pen-square" />
      </span>
      <span onClick={readFromJson} data-msg="Load From JSON" className="popup-msg">
        <i className="fas fa-download"></i>
      </span>
      <span onClick={saveFav} data-msg="Save To JSON" className="popup-msg">
        <i className="fas fa-upload"></i>
      </span>
      <span onClick={removeFav}>
        <i className="fa fa-trash-alt" />
      </span>
      <div id="fav-input">
        {edit ? (
          <input
            ref={(el) => el?.focus()}
            value={datas.current.Name}
            onChange={renameFav}
            onBlur={onBlur}
            onKeyDown={editEdit}
          />
        ) : (
          <select name="favs-list" id="" value={datas.current.Name} onChange={selectedFav}>
            {datas.favs.map((f, i) => (
              <option key={"fav-" + i} value={f.Name}>
                {f.Files?.length} {f.Name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default FavControl;
