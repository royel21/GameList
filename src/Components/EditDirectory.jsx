import { useState } from "react";
import { updateDirectory } from "../Utils/db";
import { fs } from "../Utils/utils";

const EditDirectory = ({ dir, hide }) => {
  const [Path, setPath] = useState(dir.Path);
  const [error, setError] = useState();

  const onChange = ({ target: { value } }) => setPath(value);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      renameFile();
    }
  };

  const renameFile = async () => {
    if (dir.Path === Path) return setError("The path is the same as before.");
    if (!fs.existsSync(Path)) return setError("The specified path does not exist.");

    try {
      await updateDirectory(dir, Path);
    } catch (err) {
      console.log(err);
    }
    hide();
  };

  return (
    <div id="modal-container">
      <div id="modal">
        <div className="header">Rename File</div>
        <div className="body">
          <div className="input-control">
            <span className="span-label">Name</span>
            <textarea value={Path} onChange={onChange} onKeyDown={onKeyDown}></textarea>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="footer">
          <button style={{ marginRight: "5px" }} onClick={renameFile}>
            Save
          </button>
          <button onClick={() => hide()}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditDirectory;
