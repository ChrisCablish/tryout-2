module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Notes",
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "notes",
      underscored: true,
    }
  );

  return Note;
};
