'use strict';

const path = require('path');
const axios = require('axios');
const { error } = require('../alert');
const cheerio = require('cheerio');
const download = require('../download');
const series = require('../series');

const MAIN_DOMAIN = 'https://manhua.dmzj.com/';
const IMAGE_DOMAIN = 'https://images.dmzj.com/';

const parseImage = (url) => () => {
  return axios.get(url)
    .then(({ data }) => {
      const js = /<script type="text\/javascript">([\s\S]+?)<\/script>/gi.exec(data)[1];
      (0, eval)(js.replace(/var (\w+) = (\w+) = ([^\n]+)\n/g, 'var $1 = $3\nvar $2 = $1\n'));
      return series(arr_pages.map((page) => download.bind(null, 
        IMAGE_DOMAIN + page,
        path.resolve(process.cwd(), g_comic_name, g_chapter_name, path.basename(page)),
        MAIN_DOMAIN)));
    }, error);
}

module.exports = (mid) => {
  return axios.get(MAIN_DOMAIN + mid)
    .then(({ data }) => {
      const $ = cheerio(data);
      const tasklist = [];
      $.find('.cartoon_online_border a').each((index, element) => {
        tasklist.push(MAIN_DOMAIN + element.attribs.href);
      }).get();

      return series(tasklist.map(parseImage));
    });
}
