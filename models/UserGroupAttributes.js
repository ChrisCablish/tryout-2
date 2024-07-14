//Keeps track of user's strengths and weaknesses across groups.

//Example entry: User johnsmith@email.com has the attribute "technique" applied to him as a strength
// in the context of group 1234566

module.exports = (sequelize, DataTypes) => {
  const UserGroupAttributes = sequelize.define(
    "UserGroupAttributes",
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
      attributeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "attributes",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user_group_attributes",
      underscored: true,
      indexes: [
        {
          fields: ["user_id", "group_id"],
        },
        {
          fields: ["attribute_id"],
        },
      ],
    }
  );

  return UserGroupAttributes;
};
