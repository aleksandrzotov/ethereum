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

async function getPackOfBlocks(tags) {
  return Promise.all(
    tags.map(tag => {
      const url = constructGetBlockUrl(tag, API_KEY);
      return getData(url);
    })
  ).catch(e => {
    console.log('getLastBlocksData error', e);
    throw e;
  });
}

async function getBlocksData(tags) {
  // On a large amount of blocks, the API starts to
  // return a message that the request limit has been reached:
  // "Max rate limit reached".
  // So I broke the request into stages.

  let blocks = [];
  const packSize = 10;

  for (let i = 0; i < tags.length; i += packSize) {
    const curTags = tags.slice(i, i + packSize);
    const curBlocks = await getPackOfBlocks(curTags);
    console.log(
      `Blocks with number ${i + 1} - ${i + curTags.length} from ${tags.length} was received.`
    );
    blocks = blocks.concat(curBlocks);
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

async function saveTransactionsToDB(transactions) {
  try {
    await Transactions.bulkCreate(transactions);
  } catch (error) {
    console.log('Error occurred while saving transactions to the database', error);
  }
}

async function getLastTagFromDB() {
  const lastTag = await Transactions.max('blockNumber');
  return lastTag;
}

async function addLastTransactionsToDB(startTag) {
  console.log(`Run adding transactions starting ${startTag} block`);
  const transactions = await getLastTransactions(startTag);
  await saveTransactionsToDB(transactions);
}

async function updateTransactionsInDB() {
  let startTag = await getLastTagFromDB();
  if (!startTag) {
    startTag = START_TAG;
  }
  await addLastTransactionsToDB(startTag);
}

module.exports = {
  getData,
  getLastTransactions,
  getTransactionsByTags,
  updateTransactionsInDB,
};
