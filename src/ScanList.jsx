import { useState, useEffect, useRef } from "react";
import { path, shell, fs, ipc, selectDirectory } from "./Utils/utils";
import { addDirectory, getDirectories, getJobs } from "./Utils/db";
import EditDirectory from "./Components/EditDirectory";
import "./scandir.css";

const ScanList = () => {
  const [dirList, setDirList] = useState([]);
  const listRef = useRef();

  const [showEdit, setShowEdit] = useState();
  const removeDir = async (f) => {
    const dir = dirList.find((d) => d.Id === f.Id);
    if (dir) {
      await dir.destroy();
      setDirList(dirList.filter((d) => d.Id !== f.Id));
    }
  };

  const openDir = (f) => {
    if (fs.existsSync(f.Path)) shell.openExternal(f.Path);
  };

  const syncDir = (f) => {
    addDirectory(f).then(() => {
      setDirList([...dirList]);
    });
  };

  async function addDir() {
    const filePaths = selectDirectory();
    if (filePaths) {
      const Name = path.basename(filePaths[0]);
      let { isNew, directory } = await addDirectory({ Name, Path: filePaths[0] });
      if (isNew) {
        setDirList([...dirList, directory]);
      } else {
        setDirList([...dirList]);
      }
    }
  }

  useEffect(() => {
    let isMounted = true;
    getDirectories().then((dirs) => {
      if (isMounted) {
        setDirList(dirs);
      }
    });

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const reload = () => {
      if (isMounted) {
        setDirList((dirs) => [...dirs]);
      }
    };

    ipc.on("job-done", reload);

    return () => {
      delete ipc.off("job-done", reload);
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.querySelector(".title").textContent = (dirList.length || 0) + " - Scan List";
  });

  return (
    <>
      {showEdit && <EditDirectory dir={showEdit} hide={() => setShowEdit()} />}
      <div id="list" className="scan-list">
        <div ref={listRef} id="files-list">
          <ul>
            {dirList.map((f, i) => (
              <li key={"f-" + i} onDoubleClick={() => openDir(f)} className="popup-msg" tabIndex="0" data-msg={f.Path}>
                <i className="fas fa-trash-alt" onClick={(e) => removeDir(f, e)}></i>
                <i
                  className={`fas fa-sync ${getJobs().includes(f.Id) && "fa-spin"}`}
                  onClick={() => syncDir(f)}
                ></i>{" "}
                <i className={`fas fa-edit`} onClick={() => setShowEdit(f)}></i> {f.Name}
                <span className="g-count">{f.dataValues.Count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div id="list-control">
          <span className="add-icon" onClick={addDir}>
            <i className="fas fa-plus-square"></i>
          </span>
        </div>
      </div>
    </>
  );
};

export default ScanList;
