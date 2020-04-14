const { getData, getTransactionsByTags } = require('./src/utils');
const { LAST_BLOCK_TAG_URL, BLOCKS_AMOUNT } = require('./config');

async function getLastsBlockTags(amount) {
  const lastBlock = await getData(LAST_BLOCK_TAG_URL);
  const lastTagInDecimal = parseInt(lastBlock.result, 16);
  const tags = Array.from(Array(amount)).map((item, index) => {
    const newTag = lastTagInDecimal - index;
    return newTag.toString(16);
  });
  return tags;
}

function transactionDataSave(transaction, recipientsProfit) {
  const { recipient, profit } = transaction;
  if (recipientsProfit.has(recipient)) {
    const oldValue = recipientsProfit.get(recipient);
    recipientsProfit.set(recipient, oldValue + profit);
  } else {
    recipientsProfit.set(recipient, profit);
  }
}

async function searchRichestRecipient() {
  const tags = await getLastsBlockTags(BLOCKS_AMOUNT);
  const transactions = await getTransactionsByTags(tags);

  const recipientsProfit = new Map();
  transactions.forEach(transaction => transactionDataSave(transaction, recipientsProfit));

  const richestRecipient = [...recipientsProfit.entries()].reduce(
    (acc, recipient) => (recipient[1] > acc[1] ? recipient : acc)
  );

  const [recipient, profit] = richestRecipient;
  console.log(`Richest recipient by last ${BLOCKS_AMOUNT} blocks - ${recipient}`);
  console.log(`His profit was ${profit}`);
}

searchRichestRecipient();
