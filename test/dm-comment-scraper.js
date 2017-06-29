'use strict';

const fs = require('fs');
const nock = require('nock');
const mocha = require('mocha');
const sinon = require('sinon');
const assert = require('assert');
const scraper = require('../lib/dm-comment-scraper');
const sandbox = sinon.sandbox.create();

describe('DM API', () => {
  afterEach(() => {
    sandbox.restore();
  });

  const HOST = 'http://www.dailymail.co.uk';
  const url = 'http://www.dailymail.co.uk/news/article-4493596/Labour-s-manifesto-Britain-1970s.html';

  it('errors when an invalid URL is given', () => {
    const url = 'http://spaghetti.policy';
    scraper.scrape(url, (err, res) => {
      assert.ok(err);
      assert.equal(err.message, 'Invalid article URL');
    });
  });

  it('returns a list of comments when given valid article URL', (done) => {
    nock(HOST).get('/reader-comments/p/asset/readcomments/4493596?max=50').reply(200, {
      payload: {
        assetId: "4493596",
        page: ['comment1', 'comment2']
      }
    });

    scraper.scrape(url, (err, res) => {
      assert.ifError(err);
      assert.equal(res[0], 'comment1');
      assert.equal(res[1], 'comment2');
      done();
    });
  });

  it('saves comment list to file', (done) => {
      const writer = sandbox.stub(fs, 'writeFile').yields(null, 'swaggie');

      nock(HOST).get('/reader-comments/p/asset/readcomments/4493596?max=50').reply(200, {
        payload: {
          assetId: "4493596",
          page: ['comment1', 'comment2']
        }
      });

      scraper.save(url, (err, res) => {
        assert.ifError(err);
        sinon.assert.called(writer);
        done();
      });
  });
});
