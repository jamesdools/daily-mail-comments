'use strict';

const scraper = require('../src/guardian-comment-scraper');
const url = 'https://www.theguardian.com/politics/live/2017/may/31/general-election-2017-may-corbyn-bbc-debate-campaign-personal-politics-live';

scraper(url);
