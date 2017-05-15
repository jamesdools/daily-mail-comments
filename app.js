'use strict';

const analysis = require('./src/analysis');
const annotatedComments = require('./test/fixtures/annotated-comments-4493596');

console.log(analysis.generateWordcloud(annotatedComments));
// console.log(analysis.overallSentiment(annotatedComments));
