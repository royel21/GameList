const Sequelize = require("sequelize");
const os = require("os");
const path = require("path");
const fs = require("fs-extra");

const baseDir = path.join(os.homedir(), ".rc-studio", "db-gamelist");

if (!fs.existsSync(baseDir)) fs.mkdirsSync(baseDir);

const storage = process.env.local ? "../gamelist.db" : path.join(baseDir, "gamelist.db");

const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize(null, null, null, {
  logging: false,
  dialect: "sqlite",
  storage,
  define: {
    timestamps: false,
  },
});

const db = {};

db.Op = Sequelize.Op;
db.sqlze = sequelize;

db.Directory = require("./Directory")(sequelize, DataTypes);
db.Game = require("./Games")(sequelize, DataTypes);
db.Info = require("./Info")(sequelize, DataTypes);

db.Directory.hasMany(db.Game, { foreignKey: "DirectoryId", onDelete: "CASCADE" });

db.Game.hasOne(db.Info, {
  foreignKey: "Codes",
  constraints: false,
});

db.Info.belongsTo(db.Game, { foreignKey: "Codes", targetKey: "Codes", constraints: false });

db.init = async (force = false) => {
  await sequelize.sync({ force });
};

module.exports = db;
