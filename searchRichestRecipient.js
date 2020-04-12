const { getData, getBlocksData } = require('./src/utils');

const LAST_BLOCK_TAG_URL = 'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber';
const BLOCKS_AMOUNT = 100;

const recipientsProfit = new Map();

async function getLastsBlockTags(amount) {
  const lastBlock = await getData(LAST_BLOCK_TAG_URL);
  const lastTagInDecimal = parseInt(lastBlock.result, 16);
  const tags = Array.from(Array(amount)).map((item, index) => {
    const newTag = lastTagInDecimal - index;
    return newTag.toString(16);
  });
  return tags;
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
    if (block.result && block.result.transactions) {
      const { transactions } = block.result;
      transactions.forEach(transaction => transactionDataSave(transaction));
    } else {
      console.log('recieved bad block');
    }
  });
}

async function searchRichestRecipient() {
  const tags = await getLastsBlockTags(BLOCKS_AMOUNT);
  const blocks = await getBlocksData(tags);
  blocksDataSave(blocks);
  const richestRecipient = [...recipientsProfit.entries()].reduce(
    (acc, recipient) => (recipient[1] > acc[1] ? recipient : acc)
  );
  const [recipient, profit] = richestRecipient;
  console.log(`Richest recipient by last ${BLOCKS_AMOUNT} blocks - ${recipient}`);
  console.log(`His profit was ${profit}`);
}

searchRichestRecipient();
