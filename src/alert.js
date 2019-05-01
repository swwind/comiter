'use strict';

require('colors');

const error = (message = '') => {
  console.error('[ERRO]'.red, message);
}
const warn = (message = '') => {
  console.warn('[WARN]'.yellow, message);
}
const info = (message = '') => {
  console.log('[INFO]'.white, message);
}

module.exports = {
  error,
  warn,
  info
}
