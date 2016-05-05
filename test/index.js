/* globals describe, before, beforeEach, after, afterEach, it */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
chai.should();
//chai.use(require('chai-things')); //http://chaijs.com/plugins/chai-things

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');

var MiniRestMonitoringProcess = require('../lib/');


describe('mini-rest-monitoring-process', function () {

  describe('exports', function () {
    it('expect to export function', function () {
      expect(typeof MiniRestMonitoringProcess === 'function');
    });

    it('expect init() to return function', function () {
      expect(typeof MiniRestMonitoringProcess() === 'function');
    });
  });


  describe('expect to return proper HTTP response', function () {
    var app, next;

    before('before', function() {
      app = express();
      app.use(bodyParser.json());
      app.use('/', MiniRestMonitoringProcess());

      next = function() { throw new Error('next() must never be called'); };
    });

    it('expect to return valid HTTP response for parent handler', function (done) {
      request(app).get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          console.log('res.body:' + JSON.stringify(res.body,null,2));
          expect(res.body).to.have.all.keys(MiniRestMonitoringProcess.keys);
        })
        .end(done)
      ;
    });

    MiniRestMonitoringProcess.keys.forEach(function(key) {

    it('expect to return valid HTTP response for each separate handler: /'+key, function (done) {
        request(app).get('/'+key)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            console.log('res.body:' + JSON.stringify(res.body,null,2));
            //expect(res.body).to.have.all.keys(key);
          })
          .end(done)
        ;
      });
    });

  });

});
