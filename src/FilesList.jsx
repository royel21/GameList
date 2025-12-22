import { useState } from "react";

import List from "./List";
import TabItem from "./Components/TabItem";
import ToolBar from "./Components/Toolbar";
import ScanList from "./ScanList";

const getTab = (p) => ({
  list: <List {...p} />,
  scanlist: <ScanList {...p} />,
});

const FilesList = () => {
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState("list");
  const selectTab = ({ target: { id } }) => setTab(id.replace("tab-", ""));

  const p = { filter, setFilter };
  return (
    <>
      <ToolBar />
      <div id="navbar">
        <TabItem id="tab-list" checked={tab === "list"} onChange={selectTab}>
          <i className="fas fa-file"></i> <span>Files</span>
        </TabItem>
        <TabItem id="tab-scanlist" checked={tab === "scanlist"} onChange={selectTab}>
          <i className="fas fa-cog"></i> <span>Config</span>
        </TabItem>
      </div>
      {getTab(p)[tab]}
    </>
  );
};

export default FilesList;
