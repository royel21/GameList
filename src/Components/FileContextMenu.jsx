import { useState } from "react";
import { clipboard, shell } from "../Utils/utils";

const FileContextMenu = ({ data, hide }) => {
  const { file, x, y } = data;
  const [offsetY, setOffsetY] = useState(5);
  const [offsetX, setOffsetX] = useState(0);

  const cpName = () => clipboard.writeText(file.Name);

  const onClick = async (e) => {
    const ctxCommands = {
      open: () => shell.openExternal(file.Path),
      "open-ex": () => shell.showItemInFolder(file.Path),
      "cp-name": cpName,
      "cp-path": () => clipboard.writeText(file.Path),
    };

    const action = ctxCommands[e.target.id];

    action && action();
    e.target.id !== "rename" && hide();
  };

  const onElLoad = (el) => {
    if (el) {
      if (y + el.offsetHeight > window.innerHeight) {
        setOffsetY(el.offsetHeight * -1);
      } else {
        setOffsetY(5);
      }

      if (x + el.offsetWidth > window.innerWidth) {
        setOffsetX(el.offsetWidth * -1);
      } else {
        setOffsetX(0);
      }
    }
  };

  return (
    <>
      <div id="contextm" ref={onElLoad} style={{ top: `${y + offsetY}px`, left: `${x + offsetX}px` }}>
        <ul>
          <li id="open-ex" onClick={onClick}>
            Open In Explorer
          </li>
          <li id="cp-name" onClick={onClick}>
            Copy Name
          </li>
          <li id="cp-path" onClick={onClick}>
            Copy Path
          </li>
        </ul>
      </div>
    </>
  );
};

export default FileContextMenu;
