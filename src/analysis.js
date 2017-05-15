'use strict';

const _ = require('lodash');

module.exports.generateWordcloud = (data) => {
  const wordCloud = [];

  data.forEach((comment) => {
    comment.entities.forEach((entity) => {
      if (!_.find(wordCloud, {name: entity.name})) {
        wordCloud.push({
          name: entity.name,
          type: entity.type,
          metadata: entity.metadata,
          salience: entity.salience,
          count: 1
        });
      }
      else {
        _.find(wordCloud, {name: entity.name}).count++;
      }
    });
  });

  return _.sortBy(wordCloud, 'count').reverse();
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