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

if (dmzj.test(url)) {
  const mid = dmzj.exec(url)[1];
  
  info('Download from manhua.dmzj.com');
  info('Mid = ' + mid);

  require('./api/dmzj')(mid);
}
