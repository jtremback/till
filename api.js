'use strict';

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

var clientCaller = new require('./clientCaller')(client_infos);

exports.view = function (req, res) {
    
}