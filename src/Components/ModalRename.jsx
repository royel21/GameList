import { useState } from "react";
import { fs } from "../Utils/utils";

const ModalRename = ({ file, hide, reload }) => {
  const [Name, setName] = useState(file.Name);
  const onChange = ({ target: { value } }) => {
    setName(value);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      renameFile();
    }
  };

  const renameFile = async () => {
    try {
      if (file.Name === Name) return hide();
      const newFile = file.Path.replace(file.Name, Name);
      fs.renameSync(file.Path, newFile);

      file.Name = Name;
      file.Path = newFile;

      await file.save();
      if (reload) reload();
    } catch (error) {
      console.log(error);
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
            <textarea value={Name} onChange={onChange} onKeyDown={onKeyDown}></textarea>
          </div>
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

export default ModalRename;
