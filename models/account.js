'use strict';

var bcrypt = require('bcrypt');

var authenticate, hashSecret;

module.exports = function (sequelize, DataTypes) {
  var Account = sequelize.define('Account', {
    user_id: {type: DataTypes.STRING, unique: true},
    hashed_secret: {
      type: DataTypes.STRING
    }
  }, {
    instanceMethods: {
      authenticate: authenticate
    },
    hooks: {
      beforeValidate: hashSecret
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


// Callback is called with err, new_value
hashSecret = function (plaintext, callback) {
  bcrypt.hash(plaintext, 10, callback);
};