const { Sequelize } = require('sequelize');

const {
  MYSQL_HOST, MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD,
} = require('../config');

// Set up Sequelize
const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD, {
  dialect: 'mysql',
  host: MYSQL_HOST,
  port: 3306,
});

module.exports = sequelize;
