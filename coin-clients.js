'use strict';

var _ = require('lodash');
var async = _.extend(require('async'), require('async-ext')); //async.mapValues comes from async-ext
var unirest = require('unirest');

module.exports = function (client_infos) {
  this.client_infos = client_infos;

  this.callClients = function (clients, method, params, callback) {

    // Returns new object with only info from selected clients
    // If null is passed, object has info from all clients
    var clients = clients ? populate(clients, client_infos) : client_infos;

    async.mapValues(
      clients,
      function (value, key, cb) {
        var req = unirest.post('http://' + value.user + ':' + value.pass + '@' + value.host + ':' + value.port)
        .send({
          method: method,
          params: params,
          id: Date.now()
        });
        
        console.log(req.options.body)

        req.end(function(response){
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
