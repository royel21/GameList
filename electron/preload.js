const { ipcRenderer: ipc } = require("electron");

let name = document.createElement("span");

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  #name{
    position: fixed;
    bottom: 5px;
    right: 5px;
    background-color: aqua;
    z-index: 99999;
    padding: 2px 5px;
    border-radius: .25rem;
    font-weight: 600;
    font-size: 20px;
    pointer-events: none;
  }

  button{
    position: fixed;
    bottom: 5px;
    left: 5px;
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1.8rem;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
    z-index: 99999;
  }

  button:active{
    transform: scale(1.2)
  }

  #url{
    position: fixed;
    bottom: 8px;
    left: 190px;
    z-index: 99999;
    padding: 5px;
    border-radius: 0.25rem;
    font-size: 14px;
    pointer-events: none;
    color: white;
    font-family: cursive;
    z-index: 99999; 
    background-color: #0d6efd;
  }

  #url:empty{
    display: none;
  }

`;

name.id = "name";

let urls = document.createElement("span");
urls.id = "url";

let back = document.createElement("button");
let next = document.createElement("button");
let prev = document.createElement("button");

next.textContent = "Next";
prev.textContent = "Prev";
back.textContent = "Back";

prev.style.left = "68px";
next.style.left = "130px";
ipc.on("data", (e, d) => {
  localStorage.setItem("data", JSON.stringify(d));
});

const navigate = (dir) => {
  const data = localStorage.getItem("data");
  if (data) {
    const { list, current } = JSON.parse(data);
    const index = list.findIndex((f) => f === current);
    const nextItem = list[index + dir];
    if (nextItem) {
      location.href = "https://www.javbus.com/en/" + nextItem;
      localStorage.setItem("data", JSON.stringify({ list, current: nextItem }));
    }
  }
};

const toDataURL = (url) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

window.addEventListener("DOMContentLoaded", () => {
  document.head.appendChild(styleSheet);
  document.body.appendChild(back);

  back.onclick = () => history.back();

  document.body.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
      if (e.keyCode === 37) {
        history.back();
      } else if (e.keyCode === 39) {
        history.forward();
      }
    }
  });
  name.textContent = document.querySelector(".info p span:nth-child(2)")?.textContent;
  document.body.appendChild(name);
  document.body.appendChild(urls);
  document.body.appendChild(next);
  document.body.appendChild(prev);

  document.querySelectorAll("a").forEach((a) => {
    a.addEventListener("mouseenter", ({ target }) => {
      urls.textContent = target.href;
    });

    a.addEventListener("mouseleave", () => (urls.textContent = ""));
  });

  next.onclick = () => navigate(1);

  prev.onclick = () => navigate(-1);

  document.querySelectorAll(".ad-box").forEach((e) => e.remove());
  const bigImage = document.querySelector(".bigImage");
  if (bigImage) {
    bigImage.addEventListener("click", (e) => e.preventDefault());
    bigImage.onclick = async () => {
      const parts = location.pathname.split("/");
      const a = document.createElement("a");
      a.href = await toDataURL(bigImage.querySelector("img").src);
      a.download = parts[parts.length - 1] + ".jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  }

  ipc.send("item", name.textContent);
  if (ipc._events.found) delete ipc._events.found;
  ipc.on("found", (e, d) => {
    name.textContent = d + "-OK";
  });
});
