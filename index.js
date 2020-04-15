const app = require('./src/app');
const db = require('./src/models');
const { DB_UPDATE_INTERVAL } = require('./config');
const { initDB, intervalUpdateDB } = require('./src/utils');

let updaterDB;

const port = 9000;
const hostName = '0.0.0.0';

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});

function databaseConnect() {
  db.sequelize
    .authenticate()
    .then(() => {
      console.log('Connection to the database has been established successfully.');

      initDB().then(() => {
        updaterDB = setInterval(intervalUpdateDB, DB_UPDATE_INTERVAL);
      });
    })
    .catch(err => {
      console.log(`Unable to connect to the database: ${err}`);
      clearInterval(updaterDB);
      setTimeout(databaseConnect, 10000);
    });
}

databaseConnect();
