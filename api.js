'use strict';

var db = require('./models');

var client_infos = {
  DOGE: {
    host: 'localhost',
    port: 22555,
    user: 'dogecoinrpc',
    pass: '5XGwqwdaKRL5pbhEJ62XftWVATysUJ44Fdy1gjF2F61R'
  },
  BTC: {
    host: 'localhost',
    port: 22555,
    user: 'dogecoinrpc',
    pass: '5XGwqwdaKRL5pbhEJ62XftWVATysUJ44Fdy1gjF2F61R'
  }
};

var CC = require('./clientCaller');
var clientCaller = new CC(client_infos);

exports.viewWallet = function (req, res) {

};

exports.createAddress = function (req, res) {

};

exports.viewAccount = function (req, res) {
  res.json(JSON.stringify(req.user));
};

exports.createAccount = function (req, res) {
  var secret = db.Account.genSecret()
    , user_id = req.body.user_id;

  // The secret is only shown once, so theyd better write it down
  db.Account.create({ user_id: user_id, secret: secret })
  .success(function() {
    res.json({ user_id: user_id, secret: secret });
  });
};