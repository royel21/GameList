import dayjs from "dayjs";
import { db } from "./db";
import { createFav } from "./favorites";

export const { shell, clipboard } = window.require("electron");
export const remote = window.require("@electron/remote");
export const mainWindow = remote.getCurrentWindow();
export const basePath = remote.app.getAppPath();

export const path = window.require("path");
export const fs = window.require("fs-extra");
export const os = window.require("os");

const { dialog } = remote;

export const DevMode = remote.getGlobal("process").env.NODE_ENV?.trim() === "dev842764";

export const { ipcRenderer: ipc } = window.require("electron");

let types = JSON.parse(localStorage.getItem("file-types")) || ["mp4", "mkv", "ogg", "avi", "zip", "rar"];

export const getTypes = () => types;

export const saveTypes = () => localStorage.setItem("file-types", JSON.stringify(types));

export const listIcons = (ex) => {
  if (["zip", "rar"].includes(ex)) return "file-archive";
  if (["mp4", "avi", "mkv"].includes(ex)) return "play-circle";
};

export const sortByName = (a, b) => a?.Name.localeCompare(b?.Name);

export const saveToJson = (fav) => {
  const filePath = dialog.showSaveDialogSync(mainWindow, {
    title: `Save ${fav.Name}.json`,
    defaultPath: path.join(os.homedir(), "Documents", `${fav.Name}.json`),
    filters: [{ name: "Favorites", extensions: ["json"] }],
  });

  if (filePath) {
    const myFav = {
      ...fav.dataValues,
      Files: fav.Files.map((f) => {
        delete f.dataValues.FavoriteFiles;
        return f.dataValues;
      }),
    };
    fs.writeFileSync(filePath, JSON.stringify(myFav));
  }
};

export const loadFavFromJson = async (datas) => {
  const filePath = dialog.showOpenDialogSync(mainWindow, {
    title: "Select Favorite",
    defaultPath: path.join(os.homedir(), "Documents"),
    filters: [{ name: "Favorites", extensions: ["json"] }],
  });

  if (filePath) {
    const data = fs.readJSONSync(filePath[0]);

    let fav = await db.Favorite.findOne({ where: { Name: data.Name }, include: "Files" });

    if (!fav) {
      fav = await createFav(data.Name);
      datas.favs.push(fav);
      datas.favs.sort(sortByName);
      fav.Files = [];
    }

    const files = await db.File.findAll({ where: { Name: data.Files.map((f) => f.Name) } });
    const favFiles = [];

    for (let file of data.Files) {
      const found = files.find((f) => f.Name === file.Name);

      let newFile;

      if (found && fs.existsSync(path.join(found.Dir, found.Name))) {
        newFile = found;
      } else if (fs.existsSync(path.join(file.Dir, file.Name))) {
        delete file.Id;
        newFile = await db.File.create({ ...file });
        files.push(file);
      }

      if (newFile) {
        try {
          favFiles.push(newFile);
          await fav.addFile(newFile);
        } catch (error) {
          console.log("");
        }
      }
    }

    favFiles.sort(sortByName);

    fav.Files = favFiles;
    console.log(datas);

    return { ...datas, current: fav };
  }

  return { ...datas };
};

export const selectDirectory = () => {
  return dialog.showOpenDialogSync(mainWindow, {
    title: "Select folder",
    properties: ["openDirectory"],
  });
};

export const formatDate = (date) => {
  return date
    ? dayjs(date)
        .add(4, "hour")
        .format("MMM DD, YYYY")
        .split("/")
        .map((d) => d.padStart(2, "0"))
        .join("/")
    : "";
};

export const calculatePos = (event, modal) => {
  const el = event.target;
  const rect = el.getBoundingClientRect();

  let top = rect.top + 8 + rect.height;
  if (top + modal.offsetHeight + 10 > window.innerHeight) {
    top = rect.top - 22 - modal.offsetHeight;
  }

  const left = rect.x + rect.width / 2 - modal.offsetWidth / 2;
  return { top, left };
};

export const isDate = (val) => {
  if (val instanceof Date) return true;

  const d = new Date(val);

  return !isNaN(d.getTime());
};
