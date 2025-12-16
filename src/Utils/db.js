import { basePath, path, remote, mainWindow, fs, getTypes, ipc } from "./utils";
export const db = window.require(path.join(basePath, "Models"));

let appConfig;

const { and, or, like } = db.Op;

export const getConfig = () => {
  if (!appConfig) {
    appConfig = { itemPerPage: "200" };

    let tconfig = localStorage.getItem("appConfig");
    if (tconfig) {
      tconfig = JSON.parse(tconfig);
      if (tconfig.itemPerPage) {
        appConfig = tconfig;
      }
    }
  }

  return appConfig;
};

export const saveConfig = (config) => {
  for (let key in config) {
    appConfig[key] = config[key];
  }
  localStorage.setItem("appConfig", JSON.stringify(config));
};

const getFilters = (splt, filter) => {
  return {
    [splt === "&" ? and : or]: filter.split(splt).map((s) => ({
      [or]: {
        Codes: {
          [like]: "%" + s.trim() + "%",
        },
        Name: {
          [like]: "%" + s.trim() + "%",
        },
        Path: {
          [like]: "%" + s.trim() + "%",
        },
        "$Info.AltName$": {
          [like]: "%" + s.trim() + "%",
        },
        "$Info.Company$": {
          [like]: "%" + s.trim() + "%",
        },
        "$Info.ReleaseDate$": {
          [like]: "%" + s.trim() + "%",
        },
      },
    })),
  };
};

export const getGames = async (filter = "") => {
  let filters = getFilters(filter.includes("&") ? "&" : "|", filter);

  return db.Game.findAll({
    where: filters,
    order: [["Name", "ASC"]],
    include: [
      {
        model: db.Info,
        required: false,
        on: {
          "$Games.Codes$": { [db.Op.eq]: db.sqlze.col("Info.Codes") },
        },
      },
    ],
  });
};
/****************************Scan Dir********************************************/
export const getDirectories = async () => {
  return await db.Directory.findAll();
};

const jobs = [];

export const getJobs = () => {
  if (!ipc._events["removeJob"]) {
    ipc.on("removeJob", (e, j) => {
      const index = jobs.indexOf(j);
      jobs.splice(index, 1);
    });

    ipc.on("all-jobs-done", () => {
      jobs.slice(0, jobs.length);
    });
  }
  return jobs;
};

export const addDirectory = async (d) => {
  let isNew = false;
  try {
    let directory = await db.Directory.findOne({ where: { Path: d.Path } });
    if (fs.readdirSync(d.Path).length || directory) {
      if (!directory) {
        directory = await db.Directory.create(d);
        isNew = true;
      }

      await AddJob(directory.Id);

      return { directory, isNew };
    }
  } catch (error) {
    console.log(error);
  }
  return { isNew: false };
};

let Worker;
const show = false;
export const AddJob = async (job) => {
  if (!jobs.includes(job)) {
    jobs.push(job);
  }
  const queryData = { Id: job, winId: mainWindow.id, types: getTypes() };

  if (!Worker) {
    Worker = new remote.BrowserWindow({
      show,
      webPreferences: { nodeIntegration: true, webSecurity: false, contextIsolation: false, enableRemoteModule: true },
    });
    Worker.setMenu(null);
    Worker.loadURL("file://" + path.join(basePath, "Workers", "worker.html"));
    Worker.once("ready-to-show", () => {
      Worker.webContents.send("new-job", queryData);
    });
    if (show) {
      Worker.webContents.openDevTools();
    }
    Worker.on("close", () => {
      Worker = null;
    });
  } else {
    Worker.webContents.send("new-job", queryData);
  }

  return Worker;
};

export const updateDirectory = async (dir, newPath) => {
  dir.Path = newPath;
  dir.Name = path.basename(newPath);
  await dir.save();
  await dir.reload();

  await db.Game.update(
    { Path: db.sqlze.literal(`REPLACE(Path, ${dir.Path}, ${newPath})`) },
    { where: { DirectoryId: dir.Id } }
  );
};
