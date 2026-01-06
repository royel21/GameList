import { useCallback, useEffect } from "react";
import { formatDate } from "../Utils/utils";
import "./popup.css";

let popup = document.getElementById("popup");

const hidePopup = (el) => {
  popup.style.display = "none";
  popup.textContent = "";
  el.classList?.remove("popup-show");
};

const getAltName = (altname, title = "Alt Name") => {
  let data = "";
  if (altname) {
    data = altname
      .split("\n")
      .map((alt) => `<p>${alt}</p>`)
      .join("");
  }

  return altname
    ? `<div>
       <strong>${title}: </strong>
       ${data}
    </div>`
    : "";
};

const showPop = (el, file) => {
  const rect = el.getBoundingClientRect();
  popup.style.display = "block";
  popup.innerHTML = `<div class="file-info">
    ${file?.Codes ? `<div><strong>Code(s): </strong>${file.Codes}</div>` : ""}
    ${getAltName(file.Info?.AltName)}
    ${file.Info?.Company ? `<div><strong>Company: </strong>${file.Info?.Company}</div>` : ""}
    ${file.Info?.ReleaseDate ? `<div><strong>Release: </strong>${formatDate(file.Info?.ReleaseDate)}</div>` : ""}
    ${getAltName(file.Info?.Description, "Description")}
    <div><strong>Path: </strong>${file.Path}</div>
    <div>
  `;

  let top = rect.top + 8 + rect.height;
  if (top + popup.offsetHeight + 10 > window.innerHeight) {
    top = rect.top - 22 - popup.offsetHeight;
    popup.classList.add("popup-top");
  } else {
    popup.classList.remove("popup-top");
  }
  popup.style.top = top + "px";
  popup.style.left = rect.x + rect.width / 2 - popup.offsetWidth / 2 + "px";
  el.classList.add("popup-show");
};

export default function usePopup(games) {
  const watchPopup = useCallback(
    (e) => {
      hidePopup({});

      [...document.querySelectorAll(".popup-show")].forEach((el) => hidePopup(el));

      const element = e.target.closest(".popup-msg") || e.target;
      const file = games.find((g) => g.Id == +element.id);
      if (element.classList.contains("popup-msg") && file) {
        showPop(element, file);
      }
    },
    [games]
  );

  useEffect(() => {
    const listener = [
      { name: "wheel", handler: hidePopup },
      { name: "mousemove", handler: watchPopup },
      { name: "mouseleave", handler: hidePopup },
      { name: "mousedown", handler: hidePopup },
    ];

    listener.forEach((d) => document.body.addEventListener(d.name, d.handler));
    return () => {
      listener.forEach((d) => document.body.removeEventListener(d.name, d.handler));
    };
  }, [watchPopup]);
}
