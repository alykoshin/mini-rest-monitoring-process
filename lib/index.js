'use strict';

var Router = require('express').Router;


var keys = [
  'arch',
  'argv',
  'config',
  //'connected', //
  'cwd',
  'env',
  'execArgv',
  'execPath',
  'getegid',
  'geteuid',
  'getgid',
  'getgroups',
  'getuid',
  'hrtime',
  //'mainModule', contains circular JSON reference
  'memoryUsage',
  'pid',
  'platform',
  'release',
  'title',
  'umask',
  'uptime',
  'version',
  'versions',
];

function init(config, model, app) {
  var router = Router();

  // parent handler
  router['get']('/', function(req, res, next) {
    var info = {};
    keys.forEach(function(k) {
      info[k] = (typeof process[k] === 'function') ? process[k]() : process[k];
    });
    return res.json(info);
  });

  // handlers for each separate value
  keys.forEach(function(k) {
    router['get']('/'+k, function(req, res, next) {
      var info = (typeof process[k] === 'function') ? process[k]() : process[k];
      return res.json(info);
    });
  });

  return router;
}


module.exports = init;
module.exports.keys = keys;
