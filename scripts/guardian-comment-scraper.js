'use strict';

const fs = require('fs');
const async = require('async');
const config = require('config');
const client = require('../src/client');

function getContentUrl(url) {
  return url.replace('www.theguardian.com', 'content.guardianapis.com');
}

function callGuardianApi(url, cb) {
  const contentUrl = getContentUrl(url);
  const qs = {
    'api-key': config.get('guardian.key'),
    'show-fields': 'shortUrl'
  };

  client.get(contentUrl, qs, cb);
}

function getDiscussionId(str) {
  return str.substr(str.indexOf('.com/') + 7);
}

function getComments(id, cb) {
  const url = `https://discussion.guardianapis.com/discussion-api/discussion/p/${id}`;
  const commentCount = 100;
  const qs = {
    pageSize: commentCount
  };

  client.get(url, qs, cb);
}

module.exports = (url) => {
  async.waterfall([
    function(done) {
      callGuardianApi(url, done);
    },
    function(res, done) {
      const discussionId = getDiscussionId(res.response.content.fields.shortUrl);
      getComments(discussionId, done);
    }
  ], (err, results) => {
    if (err) console.log(err);

    const id = results.discussion.key.substr(3);
    fs.writeFileSync(`test/fixtures/guardian-comments-${id}.json`, JSON.stringify(results.discussion.comments));
  });
};

const url = 'https://www.theguardian.com/politics/live/2017/may/31/general-election-2017-may-corbyn-bbc-debate-campaign-personal-politics-live';
module.exports(url);
