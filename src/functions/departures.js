let rp = require("request-promise");

exports.handler = function(event, context, callback) {
  console.log(`Getting departures for stop ${event.queryStringParameters.stop}`);
  let skanetrafikenUrl =
    `http://www.labs.skanetrafiken.se/v2.2/stationresults.asp?selPointFrKey=${event.queryStringParameters.stop}`;

  rp(skanetrafikenUrl)
    .then(function (body) {
      callback(null, {
        statusCode: 200,
        body
      });
    });
};
