"use strict";

const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importing the instance from database.js
const process = require("process");
const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      //return a shallow array of all files that meet the following criteria:
      file.indexOf(".") !== 0 && //doesn't start with .
      file !== basename && //it isn't this file
      file.slice(-3) === ".js" && //it is a .js file
      file.indexOf(".test.js") === -1 //it isn't a test file
    );
  })
  .forEach((file) => {
    //for each of the files in the shallow copy array
    const model = require(path.join(__dirname, file))(
      //require a model file (such as user.js) which calls a function with arguments
      sequelize,
      DataTypes
    );
    db[model.name] = model; //populate db object with key:value pairs representing the models
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; //my specific instance of sequelize
db.Sequelize = require("sequelize"); //the sequelize library itself.

module.exports = db;
