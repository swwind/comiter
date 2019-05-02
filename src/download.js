'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { error, warn, info } = require('./alert');

const download = (url, savepath, headers, fallbackurl = []) => {

  const simplifed = savepath.replace(process.cwd(), '.');
  if (fs.existsSync(savepath) && fs.lstatSync(savepath).size > 0) {
    // file already existed, skipping
    warn(simplifed + ' already existed, skipping');
    return Promise.resolve(null);
  }

  const dirname = path.dirname(savepath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, {
      recursive: true
    });
  }

  return axios.get(url, {
    responseType: 'arraybuffer',
    headers,
  }).then((res) => {
    fs.writeFileSync(savepath, res.data);
    info('Saved to ' + simplifed);
  }, (err) => {
    error(`Failed to download ${url}`);
    error(err.toString());
    if (fallbackurl.length) {
      const fallback = fallbackurl.shift();
      error('Trying fallback ' + fallback);
      return download(fallback, savepath, headers, fallbackurl);
    }
  })
}

module.exports = download;
