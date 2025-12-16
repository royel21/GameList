const { app, ipcMain, BrowserWindow } = require("electron");
const os = require("os");
const fs = require("fs-extra");
const path = require("path");
const url = require("url");

const setTextMenu = require("./menu");

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
// in the main process:
require("@electron/remote/main").initialize();

const isDevMode = process.env.NODE_ENV?.trim() === "dev842764";

if (isDevMode) {
  require("dotenv").config({ path: "../.env" });
} else {
  require("dotenv").config({ path: ".env" });
}

app.allowRendererProcessReuse = false;

let win;

const startUrl = isDevMode
  ? `http:\\localhost:5005`
  : url.pathToFileURL(path.join(__dirname, "build", "index.html")).href;

if (isDevMode) {
  console.log("Running in dev mode");
}

function createWin() {
  win = new BrowserWindow({
    title: "File Manager",
    minHeight: 320,
    minWidth: 400,
    show: false,
    height: 620,
    transparent: true,
    frame: false,
    width: 450,
    icon: path.join(__dirname, "FileLister.ico"),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true,
      spellcheck: false,
    },
  });

  win.setMenu(null);

  win.on("ready-to-show", () => {
    win.show();
  });

  win.on("close", () => app.quit());
  //Dev Tools
  win.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown") {
      if (input.key === "F12") {
        win.webContents.toggleDevTools();
      }
      if (input.key === "F5") win.reload();
    }
  });
  setTextMenu(win);
  win.loadURL(startUrl);

  //This is used in mac for recreate the window
  app.on("activate", () => {
    try {
      if (win === null) {
        createWin();
      }
    } catch (error) {
      console.log(error);
    }
  });
}

app.on("browser-window-created", (_, window) => {
  require("@electron/remote/main").enable(window.webContents);
});

app.commandLine.appendSwitch("--disable-http-cache");

app.on("close", () => (win = null));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("item", (e, item) => {
  win.webContents.send("item", item);
});

//Create the window when electron is ready
app.on("ready", () => {
  createWin();
});

//Release the resource when the window is close+

var appPath = path.join(os.homedir(), ".rc-studio", "files-list");

if (!fs.existsSync(appPath)) {
  fs.mkdirsSync(appPath);
}

app.setPath("userData", appPath);
