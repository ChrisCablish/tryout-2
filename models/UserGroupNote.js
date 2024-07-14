module.exports = (sequelize, DataTypes) => {
  const UserGroupNote = sequelize.define(
    "UserGroupNote",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "groups",
          key: "id",
        },
      },
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "notes",
          key: "id",
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "user_group_notes",
      underscored: true,
      indexes: [
        {
          fields: ["user_id", "group_id"],
        },
        {
          fields: ["note_id"],
        },
        {
          fields: ["author_id"],
        },
      ],
    }
  );

  return UserGroupNote;
};
