'use strict';

const config = require('config');
const languageClient = require('@google-cloud/language')(config.gcp);
// const languageClientBeta = require('@google-cloud/language').v1beta2().languageServiceClient();

module.exports.getEntities = (comment, cb) => {
  // TODO: some pre-processing
  languageClient.detectEntities(comment, cb);
};

module.exports.getSentiment = (comment, cb) => {
  // TODO: some pre-processing
  languageClient.detectSentiment(comment, cb);
};

module.exports.annotate = (comment, cb) => {
  // TODO: some pre-processing
  languageClient.annotate(comment, cb);
};

// module.exports.getEntitySentiment = (comment, cb) => {
//   const data = comment.message;
//
//   languageClientBeta.analyzeEntitySentiment(data, cb);
// };