/*
JSON is automatically included with each app.

Use the $fh.ready() (http://docs.feedhenry.com/wiki/Ready) function to trigger 
loading the local config and binding a click event to invoke the cloud action 
call which will return the remote config.
*/

$fh.ready(function() {
  // The local config variable from config.js can be accessed directly
  document.getElementById('localConfig').innerHTML = "<p>" + JSON.stringify(config) + "</p>";

  document.getElementById('run_button').onclick = function() {
    // Invoke a cloud action call to get the remote configuration
    // See: http://docs.feedhenry.com/wiki/Actions
    var username = document.getElementById('username').value,
    password = document.getElementById('password').value;

    $fh.auth({
      "policyId": "FeedHenry",
      "clientToken" : "dn6u3NNrp2gLIAo5bNJqfyfD",
      "params": {
        "userId": username,
        "password": password
      }
    }, function(res) {
      alert('succ');
      // Authentication successful - store sessionToken in variable
      var sessionToken = res.sessionToken;
      doMashup();
    }, function(msg, err) {
      alert(msg);
      if (err && err.message && (err.message === "device_purge_data" || err === err.message === "user_purge_data")){
        localStorage.clear();
        document.body.innerHTML = "";
      }
    });


  };
});

function renderContent(res){
  document.getElementById('cloudConfig').innerHTML = "<h4>Last timestamp: " +res.timestamp+ "</h4>";
  for (var i=0; i<res.blogspot.length; i++){
    var b = res.blogspot[i];
    document.getElementById('cloudConfig').innerHTML += "<h1>" +b.title + "</h1>";
    //document.getElementById('cloudConfig').innerHTML += "<p>" +b.content + "</p>";


  }
}

function doMashup(){
  var lastHash = localStorage.getItem('hash');
  $fh.act(
  {
    act:'mashup',
    req : {
      hash : lastHash
    }
  },
  function(res) {
    localStorage.setItem('hash', res.hash);
    localStorage.setItem('content', JSON.stringify(res));

    renderContent(res);


  },
  function(code,errorprops,params) {
    var content = localStorage.getItem('content');
    if (content){
      var c = JSON.parse(content);
      renderContent(c);
    }else{
      alert('No offline data found');
    }
  }
  );
}