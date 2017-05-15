'use strict';

const _ = require('lodash');

module.exports.generateWordcloud = (data) => {
  const wordCloud = {};

  data.forEach((comment) => {
    comment.entities.forEach((entity) => {
      if (!wordCloud[entity.name]) {
        wordCloud[entity.name] = {
          count: 1,
          type: entity.type,
          metadata: entity.metadata,
          salience: entity.salience
        }
      }
      else {
        wordCloud[entity.name].count++;
      }
    });
  });

  return wordCloud;
}

module.exports.overallSentiment = (data) => {
  const MAX = 2;

  const overallSentiment = {
    magnitude: 0,
    score: 0
  }

  data.forEach((comment) => {
    const magnitude = (comment.sentiment.magnitude > MAX) ? MAX : comment.sentiment.magnitude;
    //TODO: apply weights to positive/negative scores

    overallSentiment.score += comment.sentiment.score;
  });

  overallSentiment.score = overallSentiment.score / data.length;
  return overallSentiment;
};

function voteScore(voteRating, voteCount) {
  return (voteRating / voteCount) * 100; //TODO: handle +/-
}

module.exports.lowestRatedComments = (data) => {
    const orderedData = _.sortBy(data, (comment) => {
      return voteScore(comment.voteRating, comment.voteCount);
    });

    return orderedData.slice(0, 10);
}

module.exports.highestRatedComments = (data) => {
    const orderedData = _.sortBy(data, (comment) => {
      return voteScore(comment.voteRating, comment.voteCount);
    }).reverse();

    return orderedData.slice(0, 10);
}