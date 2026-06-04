const sequelize =
  require("../config/database");

const { Sequelize, DataTypes } =
  require("sequelize");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.PlcLog = require("./PlcLog")(
  sequelize,
  DataTypes
);

module.exports = db;