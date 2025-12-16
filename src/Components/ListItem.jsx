import prettyBytes from "pretty-bytes";
import { listIcons } from "../Utils/utils";

const ListItem = ({ file, onShowMemu, onRemoveDir, openFile }) => {
  const showM = (e, f) => onShowMemu({ file: f, y: e.pageY, x: e.pageX });

  const onRemove = () => onRemoveDir(file);
  const onContextM = (e) => showM(e, file);
  const open = (e) => openFile(file, e);

  const msg = prettyBytes(file.Size) + " - " + file.Path;

  return (
    <li onDoubleClick={open} className="popup-msg" tabIndex="0" data-msg={msg} onContextMenu={onContextM}>
      <i className="fas fa-trash-alt" onClick={onRemove}></i>
      <i className={"fas fa-" + listIcons(file.Extension)} onClick={open}></i> {file.Name}
    </li>
  );
};

export default ListItem;
