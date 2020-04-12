const fetch = require('node-fetch');
const { API_KEY } = require('../../config');

async function getData(url) {
  const res = await fetch(url);
  const jsonDaata = await res.text();
  const data = JSON.parse(jsonDaata);
  return data;
}

async function getBlocksData(tags) {
  // On a large number of blocks, the API starts to
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
    const url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${
      tags[i]
    }&boolean=true&apikey=${API_KEY}`;
    const block = await getData(url);
    blocks.push(block);
    console.log(`block with number ${i} was received`);
  }
  return blocks;
}

module.exports = {
  getData,
  getBlocksData,
};
