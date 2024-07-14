module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Roles",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
      underscored: true,
    }
  );

  return Role;
};
