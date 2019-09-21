'use strict';

const path = require('path');
const fs = require('fs').promises;
const pug = require('pug');
const express = require('express');

const parselist = require('./parselist');

const main = async () => {

  if (!process.argv[2]) {
    console.log('Please provide a folder');
    return;
  }

  const dirname = path.resolve(process.cwd(), process.argv[2]);
  const index = pug.compile(await fs.readFile(path.resolve(__dirname, 'index.pug'), 'utf-8'));

  const stat = await fs.stat(dirname);
  if (!stat.isDirectory()) {
    console.error('argument must be a folder');
    return;
  }

  const list = parselist(await fs.readdir(dirname));

  const app = express();
  app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
  app.use('/dplayer', express.static(path.resolve(__dirname, '..', '..', 'node_modules', 'dplayer', 'dist')));
  app.use(express.static(dirname));
  app.use('/', (req, res, next) => {
    if (req.url === '/') {
      res.end(index({
        title: path.basename(dirname),
        list,
      }));
      return;
    }

    next();
  });

  app.listen(1989);

  console.log('listen on http://localhost:1989');

}

main();
