'use strict';

var express = require('express');
var passport = require('passport');
var db = require('./models');
var api = require('./api');
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
      user.authenticate(secret, function (authd) {
        if (!authd) return callback(new Error('Failed authentication.'));
        // Success
        return callback(null, user);
      });
    });
  }
));



var app = express();

// configure Express
app.configure(function() {
  // Strips auth secret from logs *VERY IMPORTANT!*
  app.use(function(req, res, next){
    var safe_url = req.url.match(/\@(.*)/);
    console.log('request: %s %s', req.method, req.url);
    next();
  });
  app.use(express.json({strict: true}));
  app.use(passport.initialize());
  app.use(app.router);
});


// curl -v -I http://bob:secret@127.0.0.1:3000/
app.post('/account', api.createAccount);
app.get('/account', passport.authenticate('basic', { session: false }), api.viewAccount);

// Init db and start server
db.sequelize
.sync({ force: false })
.complete(function(err) {
  if (err) {
    throw err;
  } else {
    app.listen(3000, function(){
      console.log('Express server listening on port ' + 3000);
    });
  }
});
