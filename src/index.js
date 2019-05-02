'use strict';

const fs = require('fs');
const path = require('path');
const { error, warn, info } = require('./alert');

const selfInfo = require('../package.json');

const url = process.argv[2];
if (!url) {
  console.log(fs.readFileSync(path.resolve(__dirname, 'help.txt'), 'utf8'));
  process.exit(1);
}

info(`Comiter v${selfInfo.version}`);

// start parse url

const dmzj = /^https?:\/\/manhua\.dmzj\.com\/(\w+)/i;
const mss = /^https?:\/\/(?:hcomic1\.com|hcomic2\.com|hmghmg\.xyz|hcomic\.in|hcomic\.rocks)\/(\w+)\/s\/(\d+)/i;

if (dmzj.test(url)) {
  const mid = dmzj.exec(url)[1];
  
  info('Download from 「动漫之家」');
  info('Mid = ' + mid);

  require('./api/dmzj')(mid);
} else if (mss.test(url)) {
  const [_, lang, pid] = mss.exec(url);

  info('Download from 「喵绅士」');
  info('Language = ' + lang);
  info('Mid = ' + pid);

  require('./api/mss')(lang, pid);
}
