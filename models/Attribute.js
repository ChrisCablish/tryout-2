module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define(
    "Attributes",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "attributes",
      underscored: true,
    }
  );
  return Attribute;
};
