const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';

function createSequelize() {
  if (dialect === 'sqlite') {
    const storage = path.resolve(
      process.cwd(),
      process.env.DB_STORAGE || 'data/plc_monitoring.sqlite'
    );

    fs.mkdirSync(path.dirname(storage), {
      recursive: true,
    });

    return new Sequelize({
      dialect: 'sqlite',
      storage,
      logging: false,
    });
  }

  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
    }
  );
}

const sequelize = createSequelize();

module.exports = sequelize;
