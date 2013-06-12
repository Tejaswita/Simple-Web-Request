var util = require('util');
var request = require('request'),
async = require('async');

exports.mashup = function(params, callback) {

  $fh.cache({
    act: "load",
    key: params.hash || ''
  }, function(err, res) {
    console.log(res);
    if (err || !res) {
      return goToBackend(params, callback);
    } else {
      console.log('Got the data from the cache');
      return callback(null, JSON.parse(res));
    }
  });
};

function _getJson(url, callback){
  request({uri: url, method: 'GET'},
  function (err, response, body) {
    if (err){
      return callback(err);
    }
    var jsonObject = JSON.parse(body);
    callback(null, jsonObject);
  });
};

function goToBackend(params, callback){
  console.log('Go to backend');

  var callsToMashup = {
    blogspot : function(cb){
      _getJson('http://gmailblog.blogspot.com/feeds/posts/default?alt=json', function(err, res){
        // Let's reformat this content to be client-friendly
        if (err){
          return cb(err);
        }
        var results = [];
        for (var i=0; res.feed && res.feed.entry && i<res.feed.entry.length; i++){
          var entry = res.feed.entry[i],
          content = entry.content['$t'],
          title = entry.title['$t'];
          results.push({
            title : title,
            content : content
          });
        }
        return cb(null, results);

      });
    },
    facebook : function(cb){
      // This content is small, friendly JSON already - let's return it straight to the client
      _getJson('http://graph.facebook.com/feedhenry', cb);
    }
  };

  // Use async flow control module to mashup two web calls
  async.parallel(callsToMashup, function(err, mashedResult){
    // now that we've called the two API's, hash the JSON response

    if (err){
      return callback(err);
    }

    $fh.hash({
      algorithm: 'MD5',
      text: JSON.stringify(mashedResult)
    }, function(err, result) {
      mashedResult.hash = result.hashvalue;
      mashedResult.timestamp = new Date().toString();
      $fh.cache({
        act: "save",
        key: result.hashvalue,
        value: JSON.stringify(mashedResult),
        expire : 10
      }, function(err, res) {

      });
      return callback(err, mashedResult);
    });
  });
}