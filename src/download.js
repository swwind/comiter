'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { error, warn, info } = require('./alert');

const URL = require('url');

const download = (url, savepath, ref, retry = 1) => {

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

  const parsedURL = URL.parse(url);
  const referer = ref || (parsedURL.protocol + '//' + parsedURL.hostname);
  // console.log(referer);

  return axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      Referer: referer
    }
  }).then((res) => {
    fs.writeFileSync(savepath, res.data);
    info('Saved to ' + simplifed);
  }, (err) => {
    error(`[${retry}/3] Failed to download ${url}`);
    if (retry < 3) {
      return download(url, savepath, ref, retry + 1);
    }
  })
}

module.exports = download;
