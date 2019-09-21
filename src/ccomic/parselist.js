
const naturalSort = require('natural-sort');

const parselist = (list) => {
  return list
    .filter((name) => /\.(jpe?g|png|gif|webp)$/i.test(name))
    .sort(naturalSort())
    .map((name) => {
      return {
        link: name,
        name: name.replace(/\.\w+$/, ''),
      }
    });
}

module.exports = parselist;
