'use strict';

const fs = require('fs');
const client = require('../src/client');

function getArticleId(url) {
  const startPoint = url.indexOf('/article-');
  const str = url.substr(startPoint, 16);
  const articleId = str.substr(str.indexOf('-') + 1);

  return articleId;
}

function getComments(url, cb) {
  const articleId = getArticleId(url);
  const commentsUrl = `http://www.dailymail.co.uk/reader-comments/p/asset/readcomments/${articleId}`;

  client(commentsUrl, cb);
}

module.exports = (url) => {
  getComments(url, (err, res) => {
    if (err) console.log(err);

    const comments = res.payload.page;

    fs.writeFileSync(`test/fixtures/top-comments-${res.payload.assetId}.json`, JSON.stringify(comments));
  });
};

// const url = 'http://www.dailymail.co.uk/news/article-4493596/Labour-s-manifesto-Britain-1970s.html';
// module.exports(url);
