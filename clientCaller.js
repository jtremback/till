'use strict';

var _ = require('lodash');
var async = _.extend(require('async'), require('async-ext')); //async.mapValues comes from async-ext
var unirest = require('unirest');

module.exports = function (client_infos) {
  this.client_infos = client_infos;

  this.callClients = function (method, params, callback) {
    async.mapValues(
      this.client_infos,
      function (value, key, cb) {
        unirest.post('http://' + value.user + ':' + value.pass + '@' + value.host + ':' + value.port)
        .send({
          method: method,
          params: params,
          id: Date.now()
        })
        .end(function(response){
          cb(null, response.body);
        });
      },
      callback);
  };
};
