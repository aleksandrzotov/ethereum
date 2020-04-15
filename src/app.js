const express = require('express');

const { getRichestRecipientFromDB } = require('./controllers/recipients');

const app = express();

app.get('/recipients/richest', getRichestRecipientFromDB);

module.exports = app;
