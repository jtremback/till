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
  function (id, secret, callback) {
    db.Account.find( { where: { id: id } } )
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
  app.use(function(req, res, next){
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

app.post('/wallets/:wallet/new_address', passport.authenticate('basic', { session: false }), api.newAddress);
app.get('/wallets/:wallet', passport.authenticate('basic', { session: false }), api.viewWallet);



app.listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});
