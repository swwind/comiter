
const naturalSort = require('natural-sort');

const parselist = (list) => {
  return list
    .filter((name) => /\.(mp4|flv)$/i.test(name))
    .sort(naturalSort())
    .map((name) => {
      return {
        link: name,
        name: name.replace(/\.\w+$/, ''),
      }
    });
}

module.exports = parselist;
