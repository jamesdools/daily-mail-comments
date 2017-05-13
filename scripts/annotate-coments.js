'use strict';

const fs = require('fs');
const languageClient = require('../src/language-client');

function annotate(comment) {
  return new Promise((res, rej) => {
    languageClient.annotate(comment, (err, results) => {
      if (err) {
        rej(err);
      } else {
        res(results);
      }
    });
  });
}

module.exports = (comments) => {

  const annotateAndLink = (comment) => {
    return annotate(comment).then((results) => {
      results.original_text = comment.message;
      return results;
    });
  };

  const getAnnotations = Promise.all(comments.map(annotateAndLink));

  getAnnotations
    .then((annotations) => {
      fs.writeFileSync(
        'test/fixtures/annotated-comments.json',
        JSON.stringify(annotations)
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

const comments = require('../test/fixtures/top-comments-4493596');
module.exports(comments);
