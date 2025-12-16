const { Menu } = require("electron");

const selectionMenu = Menu.buildFromTemplate([{ role: "copy" }, { type: "separator" }, { role: "selectAll" }]);

const inputMenu = Menu.buildFromTemplate([
  { role: "undo" },
  { role: "redo" },
  { type: "separator" },
  { role: "cut" },
  { role: "copy" },
  { role: "paste" },
  { type: "separator" },
  { role: "selectAll" },
]);

const setTextMenu = (win) => {
  win.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(win);
    } else if (selectionText && selectionText.trim() !== "") {
      selectionMenu.popup(win);
    }
  });
};

module.exports = setTextMenu;
