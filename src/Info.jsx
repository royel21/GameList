import { useState } from "react";
import "./info.css";
import { fs, getCodes, path } from "./Utils/utils";
import { createInfo, getInfo } from "./Utils/db";

const Info = ({ file, hide }) => {
  const [data, setData] = useState({ ...file.dataValues, ...(file.Info?.dataValues || {}) });
  const [error, setError] = useState();

  const onChange = ({ target: { name, value } }) => {
    if (name === "ReleaseDate") {
      value = value ? new Date(value) : null;
    }

    setData({ ...data, [name]: value });
  };

  const save = async () => {
    if (/:|\?|\*|<|>|\/|\\|"/gi.test(data.Name)) {
      data.Name = data.Name.replace("/", " ")
        .replace("*", "x")
        .replace(/\/|\\/g, " ")
        .replace(/:|\?|<|>|"/g, "");
    }

    if (data.Path !== file.Path && !fs.existsSync(data.Path)) {
      return setError("The specified path don't exists.");
    }

    if (!data.Codes) {
      data.Codes = getCodes(file) || getCodes(data);
    }

    file.Codes = data.Codes.trim();

    const info = {
      Codes: data.Codes,
      AltName: data.AltName?.trim(),
      Company: data.Company?.trim(),
      ReleaseDate: data.ReleaseDate,
      Description: data.Description?.trim(),
    };

    file.Info = await getInfo(data.Codes);

    if (file.Info == null && file.Codes.trim()) {
      file.Info = await createInfo(info);
    } else {
      await file.Info?.update(info);
    }

    if (file.Name !== data.Name) {
      file.Name = data.Name.replace(data.Codes, "")
        .replace(/\.(zip|rar|7z)$/, "")
        .trim();

      const basePath = path.dirname(file.Path);

      let ex = "";
      if (/\.[a-z0-9]{3,4}$/i.test(ex)) {
        ex = file.Path.split(/\.[a-z0-9]{3,4}/i).pop();
      }

      data.Path = path.join(basePath, file.Name + " " + data.Codes + ex).trim();
      try {
        fs.renameSync(file.Path, data.Path);
      } catch (error) {
        console.log(error);
      }
      setData({ ...data });
    }

    file.Path = data.Path.trim();

    await file.save();
    await file.reload();
    hide();
  };

  return (
    <div className="info-container">
      <div className="info">
        <div>
          <div className="name">
            <strong>Name:</strong>
          </div>
          <textarea name="Name" value={data.Name || ""} onChange={onChange}></textarea>
        </div>
        <div>
          <div className="name">
            <strong>Alt Name:</strong>
          </div>
          <textarea name="AltName" rows="3" value={data.AltName || ""} onChange={onChange}></textarea>
        </div>
        <div>
          <div className="name">
            <strong>Code(s):</strong>
          </div>
          <input name="Codes" value={data.Codes || ""} onChange={onChange} />
        </div>
        <div>
          <div className="name">
            <strong>Company/Developer:</strong>
          </div>
          <input name="Company" value={data.Company || ""} onChange={onChange} />
        </div>
        <div>
          <div className="name">
            <strong>Release Year:</strong>
          </div>
          <input
            type="date"
            name="ReleaseDate"
            value={data.ReleaseDate?.toISOString().split("T")[0] || ""}
            onChange={onChange}
          />
        </div>
        <div>
          <div className="name">
            <strong>Description:</strong>
          </div>
          <textarea name="Description" value={data.Description || ""} onChange={onChange}></textarea>
          {error && <div className="error">{error}</div>}
        </div>
        <div>
          <div className="name">
            <strong>Path:</strong>
          </div>
          <textarea name="Path" value={data.Path || ""} onChange={onChange}></textarea>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="footer">
          <button className="btn btn-secondary mr-1" onClick={save}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={hide}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
