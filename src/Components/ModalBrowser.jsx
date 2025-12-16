import { useState } from "react";
import { showPreview } from "../Utils/Preview";

const getId = (id, inc) => {
  let num = id.match(/\d+/)[0];
  let num2 = id.match(/\d+Z|\d+/)[0];
  return num2?.replace(num, +num + inc);
};

const getData = (current) => {
  let data = { id: "", part: "" };

  if (current) {
    let part = current.match("[a-zA-Z]+");
    let id = current.match("-\\d+");

    data.part = part ? part[0] : "";
    data.id = id ? id[0].replace("-", "") : "";
  }

  return data;
};

const ModalBrowser = ({ current, hide, setFilter }) => {
  const [data, setData] = useState(getData(current));

  const handler = ({ target: { name, value } }) => setData({ ...data, [name]: value });

  const go = (part, id) => {
    const jav = part.toUpperCase() + "-" + (id + "").padStart(3, "0");
    setFilter(jav);
    showPreview(jav, []);
  };

  const goTo = () => {
    if (data.part && data.id) go(data.part, data.id);
  };

  const keydown = ({ key }) => {
    if (key === "Enter") goTo();
  };

  const next = () => {
    let id = getId(data.id, 1);
    go(data.part, id);
    setData({ ...data, id });
  };

  const prev = () => {
    let id = getId(data.id, -1);
    go(data.part, id);
    setData({ ...data, id });
  };

  return (
    <div id="modal-container" className="modal-br" style={{ pointerEvents: "none", backgroundColor: "transparent" }}>
      <div id="modal" style={{ bottom: 40, pointerEvents: "all" }}>
        <div className="body">
          <div id="controls">
            <button onClick={goTo}>Go</button>
            <button onClick={prev}>Prev</button>
            <input name="part" value={data.part || ""} onChange={handler} onKeyDown={keydown} />
            <input name="id" value={data.id} onChange={handler} onKeyPress={keydown} />
            <button onClick={next}>Next</button>
            <button onClick={() => hide()}>
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBrowser;
