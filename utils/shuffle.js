#!/usr/bin/node

const basePath = process.cwd();
const fs = require("fs");

const {
  getOrigData,
} = require(`${basePath}/utils/common.js`);

const {
  baseUri,
  description,
  namePrefix,
  shuffleCollection,
  shuffleDir,
} = require(`${basePath}/src/config.js`);

const shuffleDirImages = `${shuffleDir}/images`;
const shuffleDirJson = `${shuffleDir}/json`;

const randomizeImage = (source, destination) => {
  fs.copyFile(
    `${basePath}/build/images/${source}.png`,
    `${shuffleDirImages}/${destination}.png`, (err) => {
      if (err) throw err;
    });
};

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const writeShuffledFiles = (array) => {
  shuffle(array);

  // Loop shuffled data 
  array.forEach((item, currentIndex) => {
    const assetIndex = currentIndex + 1;
    randomizeImage(item.edition, assetIndex);
    console.log(`NFT ${item.edition} is now ${assetIndex}.`);

    // Update metadata
    // Assumes chain is EVM-based; Solana not supported
    item.name = `${namePrefix} #${assetIndex}`;
    item.description = description;
    item.edition = assetIndex;
    item.image = `${baseUri}/${assetIndex}.png`;

    // Write individual JSON file
    fs.writeFileSync(
      `${shuffleDirJson}/${assetIndex}.json`,
      JSON.stringify(item, null, 2)
    );
  });

  // Write common JSON file
  fs.writeFileSync(
    `${shuffleDirJson}/_metadata_shuffle.json`,
    JSON.stringify(array, null, 2)
  );
};

console.log("Shuffle directory: ", shuffleDir);

try {
  if (shuffleCollection) {
    if (!fs.existsSync(`${shuffleDir}`)) {
      fs.mkdirSync(shuffleDir);
      fs.mkdirSync(shuffleDirImages);
      fs.mkdirSync(shuffleDirJson);
    }
    console.log("Shuffling NFTs...");
    writeShuffledFiles(getOrigData());
  }
} catch (err) {
  console.log("Shuffling error: ", err);
}