import fs from "fs-extra";

const pgkPath = "./electron/package.json";

const pkg = fs.readJSONSync(pgkPath);

const parts = pkg.version.split(".");

if (+parts[2] + 1 > 99) {
  +parts[1]++;
  parts[2] = "00";
} else {
  +parts[2]++;
}
pkg.version = parts.join(".");

fs.writeJSONSync(pgkPath, pkg);

console.log(pkg.version, pkg.date);
