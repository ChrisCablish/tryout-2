// This file is responsible for creating the Sequelize connection to the MySQL database. It initializes a Sequelize instance with specific database credentials and configuration options. Here, we define and export the sequelize instance, which is the direct connection to the database.

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tryout", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
