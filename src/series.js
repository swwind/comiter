'use strict';

module.exports = (promises) => {
  const ret = Promise.resolve(null);
  const results = [];

  return promises.reduce((result, promise, index) => {
    return result.then(() => {
      return promise().then((val) => {
        results[index] = val;
      });
    });
  }, ret).then(() => {
    return results;
  });
}