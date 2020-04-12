const app = require('./src/app');
const db = require('./src/models');

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
    })
    .catch(err => {
      console.log(`Unable to connect to the database: ${err}`);
      setTimeout(databaseConnect, 10000);
    });
}

databaseConnect();
