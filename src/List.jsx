import { useState, useEffect } from "react";
import { getGames } from "./Utils/db";
import { shell, fs, clipboard } from "./Utils/utils";
import Input from "./Components/Input";
import usePopup from "./Hooks/usePopup.js";
import FileContextMenu from "./Components/FileContextMenu";
import Info from "./Info.jsx";
import Pager from "./Components/Pager";
import "./list.css";
import "./popup.css";

const List = ({ filter, setFilter }) => {
  const [showM, setShowM] = useState();
  const [showInfo, setShowInfo] = useState();
  const [showAction, setShowAction] = useState(true);

  const [datas, setDatas] = useState({
    items: [],
    page: 0,
    totalPages: 0,
    count: 0,
  });

  const load = async (ftl, page) => {
    const result = await getGames(ftl, page);

    setFilter(ftl);
    setDatas({
      ...datas,
      items: result.items,
      page,
    });
  };

  const loadPage = ({ page }) => {
    document.querySelector("#files-list")?.scrollTo(0, 0);
    load(filter, page);
  };

  const onFilter = ({ target: { value } }) => load(value, 0);

  const clear = () => onFilter({ target: { value: "" } });

  const removeRecent = async (f) => {
    try {
      fs.removeSync(f.Path);
    } catch (error) {
      console.error(error);
    }
    await f.destroy().then(() => {});
    setDatas({
      ...datas,
      items: datas.items.filter((d) => d.Path !== f.Path),
    });
  };

  const itemClick = async (f, { target }) => {
    if (fs.existsSync(f.Path) && !target.classList.contains("fas")) {
      shell.showItemInFolder(f.Path);
    }
  };

  const showMenu = (e, f) => setShowM({ file: f, y: e.pageY, x: e.pageX });

  const select = ({ target }) => {
    const li = target.tagName === "LI" ? target : target.closest("li");
    document.querySelectorAll("li").forEach((el) => {
      if (el === li) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  };

  const paste = () => {
    const text = clipboard
      .readText()
      .trim()
      .replace("*", "x")
      .replace(/:|\?|<|>|\/|\\|"/g, "");
    if (text) {
      setFilter(text);
      load(text, 0);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getGames(filter).then((result) => {
      if (isMounted) {
        setDatas(result);
      }
    });

    return () => (isMounted = false);
  }, [filter]);

  useEffect(() => {
    document.querySelector(".title").textContent = (datas.count || 0) + " - Game List";
  });

  usePopup(datas.items);

  return (
    <>
      <span className="ctr-actions" onClick={() => setShowAction(!showAction)}>
        {showAction ? "Hide" : "Show"} Actions
      </span>
      {showInfo && <Info file={showInfo} hide={() => setShowInfo()} />}
      {showM && <FileContextMenu data={showM} hide={() => setShowM()} favs={true} />}
      <div id="list">
        <div id="files-list" onClick={() => setShowM()} onWheel={() => (showM ? setShowM() : "")}>
          <ul>
            {datas.items.length ? (
              datas.items.map((f, i) => (
                <li
                  id={f.Id}
                  key={"r-" + i}
                  tabIndex="0"
                  onDoubleClick={(e) => itemClick(f, e)}
                  onClick={select}
                  onContextMenu={(e) => showMenu(e, f)}
                  className="popup-msg"
                  data-msg={f.Path}
                >
                  <span id="f-index">{(++i + "").padStart(3, "0")}:</span> {f.Name}
                  {showAction && (
                    <span className="actions">
                      <i className={"mr-1 fas fa-edit"} onClick={() => setShowInfo(f)}></i>
                      <i className="fas fa-trash-alt" onClick={(e) => removeRecent(f, e)}></i>
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="empty">No Files</li>
            )}
          </ul>
        </div>
        <div id="list-control">
          <div className="filter">
            <span className="search-icon" onClick={paste}>
              <i className="fas fa-paste"></i>
            </span>
            <Input value={filter} placeholder="Write to Filter" onChange={onFilter} required={true} />
            <Pager data={datas} setData={loadPage} />
            <span className="clear-icon fas fa-times-circle" onClick={clear}></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
