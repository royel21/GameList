import { useCallback, useEffect } from "react";
import { formatDate } from "../Utils/utils";

let popup = document.getElementById("popup");

const hidePopup = (el) => {
  popup.style.display = "none";
  popup.textContent = "";
  el.classList?.remove("popup-show");
};

const showPop = (el, file) => {
  const rect = el.getBoundingClientRect();
  popup.style.display = "block";
  popup.innerHTML = `
    ${file?.Codes ? `<div><strong>Code(s): </strong>${file.Codes}</div>` : ""}
    ${file.Info?.AltName ? `<div><strong>Alt Names: </strong>${file.Info?.AltName}</div>` : ""}
    ${file.Info?.Company ? `<div><strong>Company: </strong>${file.Info?.Company}</div>` : ""}
    ${file.Info?.ReleaseDate ? `<div><strong>Release: </strong>${formatDate(file.Info?.ReleaseDate)}</div>` : ""}
    ${file.Info?.Description ? `<div><strong>Description: </strong>${file.Info?.Description}</div>` : ""}
    <div><strong>Path: </strong>${file.Path}</div>
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
      if (element.classList.contains("popup-msg")) {
        const file = games.find((g) => g.Id == +element.id);
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
