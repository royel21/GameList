import { useState } from "react";
import "./info.css";
import { fs } from "./Utils/utils";

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

    if (file.Name !== data.Name) {
      data.Path = file.Path.replace(file.Name, data.Name);
      fs.renameSync(file.Path, data.Path);
      setData({ ...data });
    }

    file.Name = data.Name;
    file.Codes = data.Codes;
    file.Path = data.Path;

    file.Info.Codes = data.Codes;
    file.Info.AltName = data.AltName;
    file.Info.Company = data.Company;
    file.Info.ReleaseDate = data.ReleaseDate;
    file.Info.Description = data.Description;

    await file.Info.save();
    await file.Info.reload();

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
