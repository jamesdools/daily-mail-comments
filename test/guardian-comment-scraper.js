'use strict';

const fs = require('fs');
const nock = require('nock');
const mocha = require('mocha');
const sinon = require('sinon');
const assert = require('assert');
const config = require('config');
const scraper = require('../lib/guardian-comment-scraper');
const sandbox = sinon.sandbox.create();

describe('Guardian API', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const url = 'https://www.theguardian.com/politics/live/2017/may/31/general-election-2017-may-corbyn-bbc-debate-campaign-personal-politics-live';

  const contentApiResponse = {
    response: {
      content: {
        fields: {
          shortUrl: "https://gu.com/p/6h3xa"
        }
      }
    }
  };

  const discussionApiResponse = {
    results: {
      discussion: {
        key: 'id=6h3xa',
        comments: ['comment1', 'comment2']
      }
    }
  };

  it('returns a list of comments when given valid article URL', (done) => {
    nock('https://content.guardianapis.com')
    .get('/politics/live/2017/may/31/general-election-2017-may-corbyn-bbc-debate-campaign-personal-politics-live')
    .query({
      'api-key': config.get('guardian.key'),
      'show-fields': 'shortUrl'
    })
    .reply(200, contentApiResponse);

    nock('https://discussion.guardianapis.com')
    .get('/discussion-api/discussion/p/6h3xa?pageSize=100')
    .reply(200, discussionApiResponse);


    scraper.scrape(url, (err, res) => {
      assert.ifError(err);
      assert.equal(res[0], 'comment1');
      assert.equal(res[1], 'comment2');
      done();
    });
  });

  it('saves comment list to file', (done) => {
    const writer = sandbox.stub(fs, 'writeFile').yields(null, "swaggie");

    nock('https://content.guardianapis.com')
    .get('/politics/live/2017/may/31/general-election-2017-may-corbyn-bbc-debate-campaign-personal-politics-live')
    .query({
      'api-key': config.get('guardian.key'),
      'show-fields': 'shortUrl'
    })
    .reply(200, contentApiResponse);

    nock('https://discussion.guardianapis.com')
    .get('/discussion-api/discussion/p/6h3xa?pageSize=100')
    .reply(200, discussionApiResponse);

    scraper.save(url, (err, res) => {
      assert.ifError(err);
      sinon.assert.called(writer);
      done();
    });
  });
});
