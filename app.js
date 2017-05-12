'use strict';

const languageClient = require('./src/language-client');
const comments = require('./test/fixtures/top-comments-4493596');

const comment = comments[0];

languageClient.annotate(comment, (err, results) => {
  if (err) console.log(err);
  else console.log(results);
});
