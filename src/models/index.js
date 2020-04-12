const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config/database.json');

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = ['blocks'];

models.forEach(modelName => {
  const model = sequelize.import(path.join(__dirname, modelName));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
