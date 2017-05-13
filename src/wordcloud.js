'use strict';

module.exports.generate = (data) => {
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