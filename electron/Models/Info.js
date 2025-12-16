module.exports = (sequelize, { DATE, STRING, TEXT }) => {
  const Info = sequelize.define("Info", {
    Codes: { type: STRING, primaryKey: true },
    AltName: { type: TEXT },
    Company: { type: STRING },
    ReleaseDate: { type: DATE },
    Description: { type: TEXT },
  });
  return Info;
};
