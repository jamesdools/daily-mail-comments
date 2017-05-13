'use strict';

const request = require('request');

module.exports.get = (url, cb) => {
  const opts = {
    url: url,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request.get(opts, (err, res, body) => {
    if (err) return cb(err);
    if (res.statusCode >= 400) return cb(err);

    cb(null, JSON.parse(body));
  });
};

