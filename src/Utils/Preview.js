import { db } from "./db";
import { mainWindow, remote, path, basePath, ipc } from "./utils";

let browserWin;
const WIDTH = 1100;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57";

if (ipc._events.items) delete ipc._events.item;

ipc.on("item", (e, data) => {
  db.File.findOne({ where: { Name: { [db.Op.like]: `%${data}%` } } }).then((found) => {
    if (found && browserWin) {
      browserWin.webContents.send("found", found.Name.replace(/\.(mp4|mkv|avi|ogg)/gi, ""));
    }
  });
});

const resizeWin = () => {
  if (browserWin) {
    const { height } = mainWindow.getBounds();
    const bbounds = browserWin.getBounds();
    if (height !== bbounds.height) {
      browserWin.setResizable(true);
      browserWin.setSize(WIDTH, height);
      browserWin.setResizable(false);
    }
    return true;
  }
};

const move = () => {
  if (browserWin) {
    const [x, y] = mainWindow.getPosition();
    const { width } = mainWindow.getBounds();
    browserWin.setPosition(x + width, y);
  }
};

const resize = () => {
  if (resizeWin()) move();
};

const toFront = () => {
  if (browserWin) {
    browserWin.moveTop();
    if (browserWin.isMinimized()) {
      browserWin.restore();
      resize();
    }
  }
};

export const getPreviewWin = () => browserWin;

const getName = (f) => {
  let found = f?.match(/[A-Z]+-\d+Z|[A-Z]+-\d+/g);
  return found ? found[0] : "";
};

const filterItem = (items) => {
  let d = {};
  for (let i of items) {
    if (i) d[i] = "";
  }
  return Object.keys(d);
};

const onMinimize = () => {
  if (resizeWin()) browserWin.minimize();
};

export const showPreview = async (javname, items) => {
  const current = getName(javname.split(".")[0]);
  try {
    if (!browserWin) {
      browserWin = new remote.BrowserWindow({
        show: true,
        width: WIDTH,
        maxWidth: WIDTH,
        height: mainWindow.getBounds().height,
        webPreferences: {
          nodeIntegration: false,
          webSecurity: true,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: path.join(basePath, "preload.js"),
        },
      });
      browserWin.setMenu(null);

      browserWin.on("close", () => {
        browserWin = null;

        mainWindow.removeListener("move", move);
        mainWindow.removeListener("resized", resize);
        mainWindow.removeListener("focus", toFront);
        mainWindow.removeListener("minimize", onMinimize);
      });
      browserWin.setResizable(false);
      browserWin.setMinimizable(false);
      browserWin.setMovable(false);
      browserWin.setAlwaysOnTop(mainWindow.isAlwaysOnTop());
      browserWin.webContents.setUserAgent(USER_AGENT);
      mainWindow.webContents.setUserAgent(USER_AGENT);

      //Dev Tools
      browserWin.webContents.on("before-input-event", (_, input) => {
        if (input.type === "keyDown" && input.key === "F12") {
          browserWin.webContents.toggleDevTools();
        }
      });

      mainWindow.on("move", move);
      mainWindow.on("resized", resize);
      mainWindow.on("focus", toFront);
      mainWindow.on("minimize", onMinimize);

      move();
      browserWin.once("ready-to-show", () => {
        browserWin.show();
        browserWin.webContents.send("data", { list: filterItem(items?.map((f) => getName(f.Name))), current });
      });
    } else {
      browserWin.webContents.send("data", {
        list: filterItem(items?.map((f) => getName(f.Name))),
        current,
      });
    }

    browserWin.loadURL("https://www.javbus.com/en/" + current);
  } catch (error) {
    console.log(error);
  }

  return browserWin;
};
