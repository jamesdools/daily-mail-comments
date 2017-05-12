'use strict';

const fs = require('fs');
const languageClient = require('../src/language-client');

module.exports = (comments) => {
  const annotatedData = [];

  comments.forEach((comment) => {
    languageClient.annotate(comment, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        results.original_text = comment.message;
        annotatedData.push(results);
      }
    });
  });

  fs.writeFileSync('test/fixtures/annotated-comments.json', JSON.parse(annotatedData));
};

// const comments = require('./test/fixtures/top-comments-4493596');
// module.exports(comments);
