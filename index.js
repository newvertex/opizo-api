const rp = require('request-promise-native');
const pretty = require('prettysize');
const url = require('url');

let API_URL = 'http://opizo.com/webservice/shrink';

/**
 * Add opizo.com username as environment varialbe or
 * set it with setUser function
 */
let username = process.env.OPIZO_USERNAME || '';

// Set opizo username
function setUser (user = '') {
  username = user;
}

// Check opizo server error code and return it with equal message
function serverErr(code) {
  let msg = '';

  if (code === '101') {
    msg = 'Address has not been sent';
  } else if (code === '102') {
    msg = 'Username has not been sent';
  } else if (code === '103') {
    msg = 'Address is not correct';
  } else {
    msg = 'Unknown error!'
  }

  return { 'code': code, 'message': msg };
}

// Request to get short url with promise and return promise
function shortener(link) {
  let result = {
    url: link,
    shortUrl: null
  };

  return rp.post(API_URL, {
      form: {
        url: link,
        username
      }
    })
    .then((body) => {
      if (body.length > 5) {
        result.shortUrl = body;
        return result;
      } else {
        throw serverErr(body);
      }
    })
    .catch((err) => {
      if (!result.shortUrl) {
        throw {
          code: 1,
          message: 'Server error on generating short link!',
          result: result,
          rp: err
        };
      }
    });
}

function extra(link) {
  let result = null;

  return shortener(link)
    .then((res) => {
      result = res;
      result.fileInfo = null;

      return rp.head(link);
    })
    .then(header => {
      if (typeof(header['content-length']) !== 'undefined') {
        result.fileInfo = {};
        result.fileInfo.contentLength = header['content-length'];
        result.fileInfo.sizeInMB = pretty(result.fileInfo.contentLength);

        const parsedUrl = url.parse(link);
        const fileName = parsedUrl.path.replace(parsedUrl.search, '')
          .split('/').pop();

        result.fileInfo.name = fileName;
      }

      return result;
    })
    .catch((err) => {
      console.log(err);
      if (!result) {
        throw err;
      } else if (!result.fileInfo) {
        throw {
          code: 2,
          message: 'Can\'t access to requested link',
          result: result,
          rp: err
        };
      }

    })
}

module.exports = shortener;
module.exports.extra = extra;
module.exports.setUser = setUser;
