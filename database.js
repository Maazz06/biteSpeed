const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' });

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'mysql',
  logging: false,
});

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected to MySQL!');
  } catch (err) {
    console.error('Sequelize connection error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connectDatabase,
};
