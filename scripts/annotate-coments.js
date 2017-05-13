'use strict';

const fs = require('fs');
const languageClient = require('../src/language-client');

function mapComment(comment, annotations) {
  return {
    message: comment.message,
    id: comment.id,
    assetId: comment.assetId,
    assetUrl: comment.assetUrl,
    assetHeadline: comment.assetHeadline,
    voteRating: comment.voteRating,
    voteCount: comment.voteCount,
    // replies: mapComment() : TODO: replies
    entities: annotations.entities,
    sentiment: annotations.sentiment,
    sentences: annotations.sentences
  }
}

module.exports = (comments) => {
  const annotatedData = [];
  let count = 0;

  comments.forEach((comment) => {
    languageClient.annotate(comment, (err, annotations) => {
      if (err) {
        console.log(err);
      } else {
        annotatedData.push(mapComment(comment, annotations));
      }

      count++;
      if (count === comments.length) {
        fs.writeFileSync('test/fixtures/annotated-comments.json', JSON.stringify(annotatedData));
      }
    });
  });
};

const comments = require('../test/fixtures/top-comments-4493596');
module.exports(comments);
