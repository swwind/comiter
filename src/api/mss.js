'use strict';

const path = require('path');
const axios = require('axios');
const { error, info } = require('../alert');
const download = require('../download');
const series = require('../series');

const replace = (str) => (data) => {
  let now = String(str);
  for (const key in data) {
    now = now.replace(new RegExp('\\$' + key, 'gi'), data[key]);
  }
  return now;
}

// get vid by lang and mid
const VIDS = replace('https://hcomic1.com/$lang/d/$mid/');
// get file list by lang and mid
const LIST = replace('https://hcomic1.com/$lang/$mid.js');
// get download url by lang, vid and name
// - locate cdn, maybe unstable but fastest
const LCDNDOWNLOAD = replace('https://c.mipcdn.com/i/s/https://$lang.comicstatic.xyz/img/$lang/$vid/$name');
// - cdn, seems really unstable but better than origin
const CDNDOWNLOAD = replace('https://c.mipcdn.com/i/s/https://img.comicstatic.xyz/img/$lang/$vid/$name');
// - original url, the slowest but stable
const DOWNLOAD = replace('https://img.comicstatic.xyz/img/$lang/$vid/$name');

// parse file list and download them
const parseList = (title, lang, mid, vid) => {

  return axios.get(LIST({ lang, mid }))
    .then((res) => {
      const galleryinfo = JSON.parse(res.data.slice(18).replace('},]', '}]'));
      return Promise.all(galleryinfo.map(({ lan, name }) => download(
        // cdn url
        LCDNDOWNLOAD({ lang: lan, vid, name }),
        // saved path
        path.resolve(process.cwd(), title, name),
        // headers
        { /* no special headers required */ },
        // fallback url
        [
          CDNDOWNLOAD({ lang: lan, vid, name }),
          DOWNLOAD({ lang: lan, vid, name })
        ]
      )));
    }, error);
}

module.exports = (lang, mid) => {

  // fetch vid
  return axios.get(VIDS({ lang, mid }))
    .then((res) => {
      // const title = (/<title>([\s\S]+?)<\/title>/).exec(res.data)[1].trim().slice(0, 40);
      const [_, vid] = (/download_gallery\((\d+),'\d+'\)/).exec(res.data);
      info('Vid = ' + vid);

      return parseList(lang + mid, lang, mid, vid);
    }, error);
}
