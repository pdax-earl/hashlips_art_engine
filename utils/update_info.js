#!/usr/bin/node

const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");

const {
  baseUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
} = require(`${basePath}/src/config.js`);

// read json data
let data = [];

if (fs.existsSync(`${basePath}/build/json/_metadata.json`)) {
  let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
  data = JSON.parse(rawdata);
} else if (fs.existsSync(`${basePath}/build/json`)) {
  fs.readdirSync(`${basePath}/build/json`)
    .forEach(file => {
      try {
        rawdata = fs.readFileSync(`${basePath}/build/json/${file}`);
        data.push(JSON.parse(rawdata));
      } catch {
        console.error(`Syntax error in build/json/${file}`);
      }
    });
} else {
  console.error("build/json doesn't exist");
  process.exit();
}

data.forEach((item) => {
  edition = item.edition ?? item.custom_fields.edition;
  if (network == NETWORK.sol) {
    item.name = `${namePrefix} #${edition}`;
    item.description = description;
    item.properties.creators = solanaMetadata.creators;
  } else {
    item.name = `${namePrefix} #${edition}`;
    item.description = description;
    item.image = `${baseUri}/${edition}.png`;
  }
  fs.writeFileSync(
    `${basePath}/build/json/${edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/_metadata.json`,
  JSON.stringify(data, null, 2)
);

if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      solanaMetadata.creators
    )}`
  );
} else {
  console.log(`Updated baseUri for images to ===> ${baseUri}`);
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
}
