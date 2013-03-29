Simple Web request Tutorial
=====================

1) Log into your newly created FeedHenry account  
2) Click on ‘Create an App’, then ‘Create an App From Scratch’.  
3) Call your app ‘Simple Web Request’, and give it a description.    
4) Select next, then finish.  
5) We’re going to write some NodeJS code to do a simple web request, and return raw JSON into our application. First, we need to include the module we’ll be using to do this, called ‘request’.  
Edit the file in the cloud directory called ‘package.json’, and add the content shown:  
```javascript
{
  "name": "fh-app",
  "version": "0.1.0",
  "dependencies" : {
    "fh-nodeapp" : "*"
    ,"request" : "2.16.6"
  }
}
```  
[See The Code](https://github.com/learnhenry/Simple-Web-Request/commit/1eed15f034205762ee4e6387d92e054a953f1831)
  
Here’s the cloud code we’re going to use to perform the request – add it to cloud/main.js:
```javascript
var util = require('util');
var request = require('request');

exports.getConfig = function(params, callback) {
  request({uri: 'http://search.twitter.com/search.json?q=feedhenry', method: 'GET'},
  function (err, response, body) {
      // just apply the results object to the data we send back.
      var search = JSON.parse(body);
      callback(null, {config: search.results});
  });
};
```  
  
[See The Code](https://github.com/learnhenry/Simple-Web-Request/commit/4079d32cc2392202a8fe83071478496cd2a52bb8)  

6) Save all & verify this works in the studio by clicking the “Execute cloud action call” button in the previous.  
7) Try using some other JSON API’s on the web. All you should have to change is the request and the piece of JSON returned (as underlined above).  
[See The Code](https://github.com/learnhenry/Simple-Web-Request/commit/598111bbd870f1944751afe54b6996720f382f37)
