const fetch = require('node-fetch');
const { API_KEY, START_TAG } = require('../../config');
const { Transactions } = require('../models');

const LAST_BLOCK_TAG_URL = 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber';

async function getData(url) {
  const res = await fetch(url);
  const jsonDaata = await res.text();
  const data = JSON.parse(jsonDaata);
  return data;
}

function constructGetBlockUrl(tag, apiKey) {
  return `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=true&apikey=${apiKey}`;
}

async function getBlocksData(tags) {
  // On a large amount of blocks, the API starts to
  // return a message that the request limit has been reached:
  // "Max rate limit reached"
  // Otherwise, it would be convenient to use Promise.all like this:

  // return Promise.all(
  //   tags.map(tag => {
  //     const url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=true&apikey=${API_KEY}`;
  //     return getData(url);
  //   })
  // ).catch(e => {
  //   console.log('getLastBlocksData error', e);
  //   throw e;
  // });

  const blocks = [];
  for (let i = 0; i < tags.length; i++) {
    const url = constructGetBlockUrl(tags[i], API_KEY);
    const block = await getData(url);
    blocks.push(block);
    console.log(`Block with number ${i + 1} from ${tags.length} was received.`);
  }
  return blocks;
}

async function getLastTags(startTag) {
  const lastTagInHex = await getData(LAST_BLOCK_TAG_URL);
  const lastTagInDecimal = parseInt(lastTagInHex.result, 16);
  const tagsAmount = lastTagInDecimal - startTag + 1;

  const tagsInHex = Array.from(Array(tagsAmount)).map((item, index) =>
    (index + startTag).toString(16)
  );
  return tagsInHex;
}

function extractTransactionFromBlock(block) {
  if (block.result && block.result.transactions) {
    const { transactions, number } = block.result;
    return transactions.map(t => ({
      blockNumber: parseInt(number, 16),
      recipient: t.to,
      profit: parseInt(t.value, 16),
    }));
  }
  console.log('Recieved bad block');
  return [];
}

async function getTransactionsByTags(tagsInHex) {
  const blocks = await getBlocksData(tagsInHex);

  const allTransactions = blocks.reduce((acc, block) => {
    const transactions = extractTransactionFromBlock(block);
    return acc.concat(transactions);
  }, []);

  return allTransactions;
}

async function getLastTransactions(startTag) {
  const tags = await getLastTags(startTag);
  const transactions = await getTransactionsByTags(tags);
  return transactions;
}

async function saveTransactionToDB(transactions) {
  try {
    await Transactions.bulkCreate(transactions);
  } catch (error) {
    console.log('Error occurred while saving transactions to the database', error);
  }
}

async function updateTransactionsInDB() {
  const transactions = await getLastTransactions(START_TAG);
  await saveTransactionToDB(transactions);
}

module.exports = {
  getData,
  getLastTransactions,
  getTransactionsByTags,
  saveTransactionToDB,
  updateTransactionsInDB,
};
