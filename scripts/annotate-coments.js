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
    entities: annotations.entities,
    sentiment: annotations.sentiment,
    sentences: annotations.sentences
  };
}

function annotateComment(comment) {
  return new Promise((res, rej) => {
    languageClient.annotate(comment, (err, results) => {
      if (err) {
        rej(err);
      } else {
        res(mapComment(comment, results));
      }
    });
  });
}

function annotateComments(comments) {
  return Promise.all(comments.map(annotateComment));
}

function annotateCommentAndReply(comment) {
  return Promise.all([
    annotateComment(comment),
    annotateComments(comment.replies.comments)
  ]).then((annotated) => {
    const [annotatedComment, annotatedReplies] = annotated;
    annotatedComment.replies = annotatedReplies;
    return annotatedComment;
  });
}

function createFileWriter(filename) {
  return (body) => {
    return new Promise((res, rej) => {
      fs.writeFile(filename, body, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  };
}

module.exports = (comments) => {
  return Promise.all(comments.map(annotateCommentAndReply));
};

const comments = require('../test/fixtures/top-comments-4493596');
const writeFixture = createFileWriter('test/fixtures/annotated-comments.json');
const serialiseAnnotations = (annotations) => JSON.stringify(annotations);

module.exports(comments)
  .then(serialiseAnnotations)
  .then(writeFixture)
  .catch((err) => {
    console.log(err);
  });

