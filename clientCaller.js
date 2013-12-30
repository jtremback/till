'use strict';

var _ = require('lodash');
var async = _.extend(require('async'), require('async-ext')); //async.mapValues comes from async-ext
var unirest = require('unirest');

module.exports = function (client_infos) {
  this.client_infos = client_infos;

  this.callClients = function (clients, method, params, callback) {

    // Returns new object with only info from selected clients
    var clients = populate(clients, client_infos);

    console.log(clients)

    async.mapValues(
      clients,
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

function populate(array, object) {
  var ret = {};
  array.forEach(function (value) {
    ret[value] = object[value];
  });
  return ret;
}
