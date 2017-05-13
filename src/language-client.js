'use strict';

const config = require('config');
const languageClient = require('@google-cloud/language')(config.gcp);
const languageClientBeta = require('@google-cloud/language').v1beta2().languageServiceClient();

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

module.exports.getEntitySentiment = (comment, cb) => {
  const data = comment.message;

  languageClientBeta.analyzeEntitySentiment(data, cb);
};