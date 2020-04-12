const express = require('express');

const app = express();

app.get('/a', (req, res) => {
  res.status(200).send('a');
});

module.exports = app;
