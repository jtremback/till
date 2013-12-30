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

var CoinClients = require('./coin-clients');
var coinClients = new CoinClients(client_infos);

exports.move = function (req, res) {
  var wallet = req.user.id + '-' + req.params.wallet
    , clients = req.body.coin
    , to_wallet = req.user.id + '-' + req.body.to_wallet
    , amount = req.body.amount
  ;

  var params = [ wallet, to_wallet, amount ];

  coinClients.callClients(clients, 'move', params, function (err, response) {
    return res.json(response);
  });
};

exports.view = function (req, res) {
  var wallet = req.user.id + '-' + req.params.wallet;

  var params = [ wallet ];

  coinClients.callClients(null, 'getbalance', params, function (err, response) {
    return res.json(response);
  });
};

exports.send = function (req, res) {
  var wallet = req.user.id + '-' + req.params.wallet
    , clients = req.body.coin // There should only be one. make sure to validate.
    , to_address = req.body.to_address
    , amount = req.body.amount
  ;

  var params = [ wallet, to_address, amount ];

  coinClients.callClients(clients, 'sendfrom', params, function (err, response) {
    return res.json(response);
  });
};

exports.newAddress = function (req, res) {
  var wallet = req.user.id + '-' + req.params.wallet
    , clients = req.body.coin;

  var params = [ wallet ];

  coinClients.callClients(clients, 'getnewaddress', params, function (err, response) {
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