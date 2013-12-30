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
  // Wallet ids are created by concatenating the account_id with the given wallet
  var wallet = req.user.account_id + req.query.wallet;

  clientCaller.callClients(null, 'getbalance', wallet, function (err, response) {
    return res.json(response);
  });
};

exports.newAddress = function (req, res) {
  // Wallets ids are created by concatenating the 
  var wallet = req.user.account_id + req.query.wallet
    , clients = req.body.coin;

  clientCaller.callClients(clients, 'getnewaddress', wallet, function (err, response) {
    return res.json(response);
  });
};

exports.viewAccount = function (req, res) {
  res.json(JSON.stringify(req.user));
};

exports.createAccount = function (req, res) {
  var secret = db.Account.genSecret()
    , account_id = req.body.account_id;

  // The secret is only shown once, so theyd better write it down
  db.Account.create({ id: account_id, secret: secret })
  .success(function() {
    res.json({ account_id: account_id, secret: secret });
  });
};