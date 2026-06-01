const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
  name: DataTypes.STRING,
  plcIp: DataTypes.STRING,
  protocol: DataTypes.STRING,
  status: DataTypes.STRING,
});

module.exports = Machine;
