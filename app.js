'use strict';

const wordCloud = require('./src/wordCloud');
const annotatedComments = require('./test/fixtures/annotated-comments-4493596');

console.log(wordCloud.generate(annotatedComments));