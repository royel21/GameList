import { useState } from "react";
import "./info.css";
import { fs, getCodes, path } from "./Utils/utils";
import { createInfo } from "./Utils/db";

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
      return setError('The file name contains invalid characters. : \\ / : * ? " < > |');
    }

    if (data.Path !== file.Path && !fs.existsSync(data.Path)) {
      return setError("The specified path don't exists.");
    }

    if (!data.Codes) {
      data.Codes = getCodes(file);
    }

    if (file.Name !== data.Name) {
      const basePath = path.dirname(file.Path);
      data.Path = path.join(basePath, data.Name);
      try {
        fs.renameSync(file.Path, data.Path);
      } catch (error) {
        console.log(error);
      }
      setData({ ...data });
    }

    file.Name = data.Name.trim();
    file.Codes = data.Codes.trim();
    file.Path = data.Path.trim();

    if (file.Name.includes(file.Codes)) {
      file.Name = file.Name.replace(file.Codes, "").trim();
    }

    const info = {
      Codes: data.Codes,
      AltName: data.AltName?.trim(),
      Company: data.Company?.trim(),
      ReleaseDate: data.ReleaseDate,
      Description: data.Description?.trim(),
    };

    if (file.Info == null && file.Codes.trim()) {
      file.Info = await createInfo(info);
    } else {
      await file.Info.update(info);
    }

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
          <textarea name="AltName" value={data.AltName || ""} onChange={onChange}></textarea>
        </div>
        <div>
          <div className="name">
            <strong>Code(s):</strong>
          </div>
          <input name="Codes" value={data.Codes || ""} onChange={onChange} />
        </div>
        <div>
          <div className="name">
            <strong>Company:</strong>
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
