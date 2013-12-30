'use strict';

var bcrypt = require('bcrypt')
  , crypto = require('crypto')
;

var authenticate, genSecret, hashSecret;

module.exports = function (sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    id: { type: DataTypes.STRING, unique: true },
    secret: { type: DataTypes.STRING }
  }, {
    classMethods: {
      genSecret: genSecret
    },
    instanceMethods: {
      authenticate: authenticate,
    },
    hooks: {
      beforeCreate: hashSecret
    }
  }
);
 
  return Account;
};

// Callback is called with true/false depending on
// result of authentication
authenticate = function (plaintext, callback) {
  bcrypt.compare(plaintext, this.hashed_secret, callback);
};

// Generates secret- there is no reason to have the
// developer come up with their own
genSecret = function () {
  return 'till-' + crypto.randomBytes(24).toString('hex');
};

// Callback is called with err, new_value
hashSecret = function (account, callback) {
  bcrypt.hash('bingo', 10, function (err, hashed_secret) {
    account.secret = hashed_secret;
    callback(err, account);
  });
};