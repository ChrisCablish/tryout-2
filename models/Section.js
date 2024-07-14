module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Sections",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "sections",
      underscored: true,
    }
  );
  return Section;
};
