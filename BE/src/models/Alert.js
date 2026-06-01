const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  machineId: DataTypes.INTEGER,
  type: DataTypes.STRING,
  severity: DataTypes.STRING,
  message: DataTypes.STRING,
});

module.exports = Alert;
