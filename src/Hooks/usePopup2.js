import { useEffect } from "react";

let popup = document.getElementById("popup");

const hidePopup = (el) => {
  popup.style.display = "none";
  popup.textContent = "";
  el.classList?.remove("popup-show");
};

const showPop = (el) => {
  const rect = el.getBoundingClientRect();
  const data = el.dataset;
  const msg = data.msg || el.textContent;
  popup.style.display = "block";
  popup.textContent = msg;

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

const watchPopup = (e) => {
  hidePopup({});

  [...document.querySelectorAll(".popup-show")].forEach((el) => hidePopup(el));

  const element = e.target.closest(".popup-msg2") || e.target;
  if (element.classList.contains("popup-msg2")) {
    showPop(element);
  }
};

const listener = [
  { name: "wheel", handler: hidePopup },
  { name: "mousemove", handler: watchPopup },
  { name: "mouseleave", handler: hidePopup },
  { name: "mousedown", handler: hidePopup },
];

export default function usePopup2() {
  useEffect(() => {
    listener.forEach((d) => document.body.addEventListener(d.name, d.handler));
    return () => {
      listener.forEach((d) => document.body.removeEventListener(d.name, d.handler));
    };
  }, []);
}
