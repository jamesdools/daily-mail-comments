'use strict';

const annotator = require('../lib/dm-comment-annotator');
const dailyMailComments = require('../test/fixtures/dm-comments-4493596');

annotator(dailyMailComments).catch((err) => console.log(err));
