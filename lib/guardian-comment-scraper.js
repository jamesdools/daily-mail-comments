'use strict';

const fs = require('fs');
const async = require('async');
const config = require('config');
const client = require('./client');

function getContentApiUrl(url) {
  return url.replace('www.theguardian.com', 'content.guardianapis.com');
}

function parseShortUrl(str) {
  return str.substr(str.indexOf('.com/') + 7);
}

// This requires a call to the content API to retrieve the shortUrl
// eg. https://gu.com/p/6h3xa
function getDiscussionId(url, cb) {
  const contentUrl = getContentApiUrl(url);
  const qs = {
    'api-key': config.get('guardian.key'),
    'show-fields': 'shortUrl'
  };

  client.get(contentUrl, qs, (err, res) => {
    if (err) return cb(err);
    if (!res.response) return cb(err);

    const shortUrl = res.response.content.fields.shortUrl;
    cb(null, parseShortUrl(shortUrl));
  });
}


function getComments(discussionId, cb) {
  const url = `https://discussion.guardianapis.com/discussion-api/discussion/p/${discussionId}`;
  const commentCount = 100;
  const qs = {
    pageSize: commentCount
  };

  client.get(url, qs, cb);
}

module.exports.scrape = (url, cb) => {
  async.waterfall([
    function (done) {
      getDiscussionId(url, done);
    },
    function (discussionId, done) {
      getComments(discussionId, done);
    }
  ], (err, res) => {
    if (err) return cb(err);

    const id = res.results.discussion.key.substr(3);
    const comments = res.results.discussion.comments;

    cb(null, comments);
  });
};

module.exports.save = (url, cb) => {
  async.waterfall([
    function (done) {
      getDiscussionId(url, done);
    },
    function (discussionId, done) {
      getComments(discussionId, done);
    }
  ], (err, res) => {
    if (err) return cb(err);

    const id = res.results.discussion.key.substr(3);
    const comments = res.results.discussion.comments;

    fs.writeFile(`test/fixtures/guardian-comments-${id}.json`, JSON.stringify(comments), cb);
  });
};
