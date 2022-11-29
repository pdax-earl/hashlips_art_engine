#!/usr/bin/node

const basePath = process.cwd();
const fs = require("fs");

const getOrigData = () => {
  // read json data
  let origData = [];

  if (fs.existsSync(`${basePath}/build/json/_metadata.json`)) {
    let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
    return JSON.parse(rawdata);
  } else if (fs.existsSync(`${basePath}/build/json`)) {
    fs.readdirSync(`${basePath}/build/json`)
      .forEach(file => {
        try {
          rawdata = fs.readFileSync(`${basePath}/build/json/${file}`);
          origData.push(JSON.parse(rawdata));
        } catch {
          console.error(`Syntax error in build/json/${file}`);
        }
      });
    return origData;
  } else {
    console.error("build/json doesn't exist");
    process.exit();
  }
}

module.exports = {
  getOrigData,
};