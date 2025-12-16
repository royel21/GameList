module.exports = (sequelize, { INTEGER, STRING }) => {
  const Directory = sequelize.define("Directories", {
    Id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: STRING(255),
      allowNull: false,
    },
    Path: {
      type: STRING(255),
      unique: true,
      allowNull: false,
    },
  });
  return Directory;
};
