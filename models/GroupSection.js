//Keeps track of what sections (if any) are affiliated with what groups.
//Example: Orchestra group 1234567 has 4 sections - violin, viola, cello, bass

module.exports = (sequelize, DataTypes) => {
  const GroupSection = sequelize.define(
    "GroupSection",
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "groups",
          key: "id",
        },
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
      },
    },
    {
      tableName: "group_section",
      underscored: true,
      indexes: [
        {
          fields: ["group_id", "section_Id"],
          unique: true, // Ensuring that each combination of groupId and sectionId is unique
        },
      ],
    }
  );

  return GroupSection;
};
