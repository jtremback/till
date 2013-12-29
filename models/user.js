'use strict';

var bcrypt = require('bcrypt');

var authenticate, hashSecret;

module.exports = function (sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    id: {type: DataTypes.STRING, unique: true},
    hashed_secret: DataTypes.STRING
  }, {
    instanceMethods: {
      authenticate: authenticate,
      hashSecret: hashSecret
    }
  }
);
 
  return Account;
};


authenticate = function (plaintext, callback) {
  bcrypt.compare(plaintext, this.hashed_secret, callback);
};

hashSecret = function (plaintext, callback) {
  bcrypt.hash(plaintext, 10, callback);
};