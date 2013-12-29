'use strict';

var express = require('express');
var passport = require('passport');
var db = require('./models');
var BasicStrategy = require('passport-http').BasicStrategy;

// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy(
  function (user_id, secret, callback) {
    db.Account.find( { where: { user_id: user_id } } )
    .error(function () {
      // Callback with error on no user
      return callback(new Error('Failed authentication.'));
    })
    .success(function (user) {
      // Callback with error on wrong secret
      if (!user) return callback(new Error('Failed authentication.'));
      if (!user.authenticate(secret)) return callback(new Error('Failed authentication.'));
      // Success
      return callback(null, user);
    });
  }
));



var app = express();

// configure Express
app.configure(function() {
  // Strips auth secret from logs *VERY IMPORTANT!*
  app.use(function(req, res, next){
    var safe_url = req.url.match(/\@(.*)/);
    console.log('request: %s %s', req.method, safe_url);
    next();
  });
  // Initialize Passport! Note: no need to use session middleware when each
  // request carries authentication credentials, as is the case with HTTP Basic.
  app.use(passport.initialize());
  app.use(app.router);
});


// curl -v -I http://bob:secret@127.0.0.1:3000/
app.get('/',
  // Authenticate using HTTP Basic credentials, with session support disabled.
  passport.authenticate('basic', { session: false }),
  function(req, res){
    res.json({ username: req.user.username, email: req.user.email });

});

// Init db and start server
db.sequelize
.sync({ force: true })
.complete(function(err) {
  if (err) {
    throw err;
  } else {
    app.listen(3000, function(){
      console.log('Express server listening on port ' + 3000);
    });
  }
});
