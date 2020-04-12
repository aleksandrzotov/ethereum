const app = require('./src/app');

const port = 9000;
const hostName = '0.0.0.0';

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});
