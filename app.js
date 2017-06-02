'use strict';

const analysis = require('./src/analysis');
const dmComments = require('./test/fixtures/annotated-comments-4493596');
const guardianComments = require('./test/fixtures/annotated-guardian-comments');

console.log(analysis.lowestRatedComments(dmComments));
// console.log(analysis.highestRatedComments(dmComments));
console.log(analysis.generateWordcloud(dmComments));

// console.log(analysis.lowestRatedComments(guardianComments));
// console.log(analysis.highestRatedComments(guardianComments));
// console.log(analysis.generateWordcloud(guardianComments));
