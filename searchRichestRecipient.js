const fetch = require('node-fetch');

const LAST_BLOCK_TAG_URL = 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber';
const BLOCKS_AMOUNT = 3;
const API_KEY = 'M9TN6H9RS2SX5IJDCM1S59ZDCP384NJWKE';

const recipientsProfit = new Map();

async function getData(url) {
  const res = await fetch(url);
  const jsonDaata = await res.text();
  const data = JSON.parse(jsonDaata);
  return data;
}

async function getLastsBlockTags(amount) {
  const lastBlock = await getData(LAST_BLOCK_TAG_URL);
  const lastTagInDecimal = parseInt(lastBlock.result, 16);
  const tags = Array.from(Array(amount)).map((item, index) => {
    const newTag = lastTagInDecimal - index;
    return newTag.toString(16);
  });
  return tags;
}

async function getLastBlocksData(tags) {
  return Promise.all(
    tags.map(tag => {
      const url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=true&apikey=${API_KEY}`;
      return getData(url);
    })
  );
}

function transactionDataSave(transaction) {
  const recipient = transaction.to;
  const profit = parseInt(transaction.value, 16);
  if (recipientsProfit.has(recipient)) {
    const oldValue = recipientsProfit.get(recipient);
    recipientsProfit.set(recipient, oldValue + profit);
  } else {
    recipientsProfit.set(recipient, profit);
  }
}

function blocksDataSave(blocks) {
  blocks.forEach(block => {
    const { transactions } = block.result;
    transactions.forEach(transaction => transactionDataSave(transaction));
  });
}

async function searchRichestRecipient() {
  const tags = await getLastsBlockTags(BLOCKS_AMOUNT);
  const blocks = await getLastBlocksData(tags);
  blocksDataSave(blocks);
  const richestRecipient = [...recipientsProfit.entries()].reduce(
    (acc, recipient) => (recipient[1] > acc[1] ? recipient : acc)
  );
  console.log(richestRecipient);
}

searchRichestRecipient();
