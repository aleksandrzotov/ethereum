const { Transactions } = require('../models');
const { getRichestRecipient } = require('../utils');

async function getAllTransactionFromDB() {
  const transactions = await Transactions.findAll();
  return transactions.map(tr => {
    const trInJSON = tr.toJSON();
    const { profit, recipient } = trInJSON;
    return {
      profit,
      recipient,
    };
  });
}

async function getRichestRecipientFromDB(req, res) {
  try {
    const transactions = await getAllTransactionFromDB();
    const recipient = getRichestRecipient(transactions)[0];
    res.send(recipient);
  } catch (error) {
    res.status(502).send('Error while receiving recipient', error.name);
  }
}

module.exports = {
  getRichestRecipientFromDB,
};
