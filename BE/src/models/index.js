const { Sequelize, DataTypes } =
  require("sequelize");


const sequelize = new Sequelize(
  "plc_monitoring",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);


const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;


db.PlcLog = require("./PlcLog")(
  sequelize,
  DataTypes
);


module.exports = db;
