var util = require('util');
var request = require('request');
/* main.js
 * All calls here are publicly exposed as REST API endpoints.
 * - all parameters must be passed in a single JSON paramater.
 * - the return 'callback' method signature is 'callback (error, data)', where 'data' is a JSON object.
*/

/* 'getConfig' server side REST API method.
 * Trivial example of pulling in a shared config file.
 */
exports.getConfig = function(params, callback) {
  request({uri: 'http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=1271d5f82c4bce4a546a487dd17a10f4&format=json&nojsoncallback=1&api_sig=6b429daec1a9f1a6371143662c592649', method: 'GET'},
  function (err, response, body) {
    // just apply the results object to the data we send back.
    var search = JSON.parse(body);
    callback(null, {config : search});
  });
};

