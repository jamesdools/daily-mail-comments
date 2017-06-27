'use strict';

const fs = require('fs');
const client = require('./client');

function getArticleId(url) {
  const startPoint = url.indexOf('/article-');

  if (startPoint !== -1) {
    const str = url.substr(startPoint, 16);
    const articleId = str.substr(str.indexOf('-') + 1);

    return articleId;
  }

  else return null;
}

function getComments(url, cb) {
  const articleId = getArticleId(url);
  if (!articleId) return cb(new Error('Invalid article URL'));

  const commentsUrl = `http://www.dailymail.co.uk/reader-comments/p/asset/readcomments/${articleId}`;
  const commentCount = 50;
  const qs = {
    max: commentCount
  };

  client.get(commentsUrl, qs, cb);
}

module.exports.scrape = (url, cb) => {
  getComments(url, (err, res) => {
    if (err) return cb(err);

    const comments = res.payload.page;

    cb(null, comments);
  });
};

module.exports.save = (url, cb) => {
  getComments(url, (err, res) => {
    if (err) return cb(err);

    const comments = res.payload.page;

    fs.writeFileSync(`test/fixtures/dm-comments-${res.payload.assetId}.json`, JSON.stringify(comments));

    cb();
  });
};
