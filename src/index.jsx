import { createRoot } from "react-dom/client";
import FilesList from "./FilesList";
import { ipc, mainWindow } from "./Utils/utils";
import { db } from "./Utils/db";

const root = createRoot(document.getElementById("app"));

const onError = (_, data) => {
  console.log(data);
};

db.init().then(() => {
  root.render(<FilesList />);
  ipc.off("error", onError);
  ipc.on("error", onError);

  mainWindow.setAlwaysOnTop(false);
});
