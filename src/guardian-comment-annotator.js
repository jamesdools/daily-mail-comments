'use strict';

const fs = require('fs');
const languageClient = require('./language-client');

// Guardian comments with HTML tags - we want to remove these before analysis
function stripTags(body) {
  return body.replace(/<\/?[^>]+(>|$)/g, '');
}

function mapComment(comment, annotations) {
  return {
    message: stripTags(comment.body),
    id: comment.id,
    // assetId: comment.assetId,
    // assetUrl: comment.assetUrl,
    // assetHeadline: comment.assetHeadline,
    voteRating: comment.numRecommends,
    // voteCount: comment.voteCount,
    // replies: mapComment() //TODO: replies
    entities: annotations.entities,
    sentiment: annotations.sentiment,
    sentences: annotations.sentences
  };
}

module.exports = (comments) => {
  const annotatedData = [];
  let count = 0;

  comments.forEach((comment) => {
    const text = stripTags(comment.body);

    languageClient.annotate(text, (err, annotations) => {
      if (err) {
        console.log(err);
      } else {
        annotatedData.push(mapComment(comment, annotations));
      }

      count++;
      if (count === comments.length) {
        fs.writeFileSync(`test/fixtures/annotated-guardian-comments.json`, JSON.stringify(annotatedData));
      }
    });
  });
};
