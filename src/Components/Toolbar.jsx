import { getPreviewWin } from "../Utils/Preview";
import { mainWindow } from "../Utils/utils";

const TitleBar = () => {
  const closeWindow = () => {
    mainWindow.close();
  };
  const minWindow = () => {
    mainWindow.minimize();
  };

  const maxWindow = () => {
    if (!document.webkitIsFullScreen) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  };

  const setAlwaysOnTop = ({ target: { checked } }) => {
    mainWindow.setAlwaysOnTop(checked);
    getPreviewWin()?.setAlwaysOnTop(checked);
  };

  return (
    <div id="title-bar">
      <label htmlFor="always-top" className="btn-sys">
        <input type="checkbox" name="" id="always-top" onChange={setAlwaysOnTop} />
        <i className="far fa-window-restore"></i>
      </label>
      <div id="title-n">
        <h5 className="title">Game List</h5>
        <div id="drag-region"></div>
      </div>
      <span className="btn-sys" onClick={minWindow}>
        <i className="fas fa-window-minimize"></i>
      </span>
      <span className="btn-sys" onClick={maxWindow}>
        <i className="fas fa-window-restore"></i>
      </span>
      <span className="btn-sys btn-sys-close" onClick={closeWindow}>
        <i className="fas fa-window-close"></i>
      </span>
    </div>
  );
};

export default TitleBar;
