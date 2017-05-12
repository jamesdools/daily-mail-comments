'use strict';

const config = require('config');
const languageClient = require('@google-cloud/language')(config.gcp);

module.exports.getEntities = (comment, cb) => {
  // TODO: some pre-processing
  const data = comment.message;

  languageClient.detectEntities(data, cb);
};

module.exports.getSentiment = (comment, cb) => {
  // TODO: some pre-processing
  const data = comment.message;

  languageClient.detectSentiment(data, cb);
};

module.exports.annotate = (comment, cb) => {
  // TODO: some pre-processing
  const data = comment.message;

  languageClient.annotate(data, cb);
};
