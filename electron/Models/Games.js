module.exports = (sequelize, { INTEGER, STRING }) => {
  const Game = sequelize.define(
    "Games",
    {
      Id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: { type: STRING, allowNull: false },
      Codes: { type: STRING },
      Path: { type: STRING, allowNull: false },
      DirectoryId: { type: INTEGER },
    },
    {
      uniqueKeys: {
        Uniq_File: {
          fields: ["Name", "Path"],
        },
      },
    }
  );
  return Game;
};
