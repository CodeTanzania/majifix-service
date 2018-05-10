'use strict';

/* ensure mongo uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/majifix-service');


/* dependencies */
const path = require('path');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const { Jurisdiction } = require('majifix-jurisdiction');
const { ServiceGroup } = require('majifix-service-group');
const { Priority } = require('majifix-priority');
const { Service, app, info } = require(path.join(__dirname, '..'));
let samples = require('./samples')(20);


/* connect to mongoose */
mongoose.connect(process.env.MONGODB_URI);


function boot() {

  async.waterfall([

    function clear(next) {
      Service.remove(function ( /*error, results*/ ) {
        next();
      });
    },

    function seedJurisdiction(next) {
      const jurisdiction = Jurisdiction.fake();
      Jurisdiction.remove(function ( /*error, results*/ ) {
        jurisdiction.post(next);
      });
    },

    function seedServiceGroup(jurisdiction, next) {
      const servicegroup = ServiceGroup.fake();
      ServiceGroup.remove(function ( /*error, results*/ ) {
        servicegroup.jurisdiction = jurisdiction;
        servicegroup.post(next);
      });
    },

    function seedPriority(group, next) {
      const priority = Priority.fake();
      const jurisdiction = group.jurisdiction;
      Priority.remove(function ( /*error, results*/ ) {
        priority.jurisdiction = jurisdiction;
        priority.post(function (error, created) {
          next(error, jurisdiction, group, created);
        });
      });
    },

    function seed(jurisdiction, group, priority, next) {
      /* fake services */
      samples = _.map(samples, function (sample, index) {
        sample.jurisdiction = jurisdiction;
        sample.group = group;
        if ((index % 2 === 0)) {
          sample.priority = priority;
        }
        return sample;
      });
      /* fake services */
      Service.create(samples, next);
    }

  ], function (error, results) {

    /* expose module info */
    app.get('/', function (request, response) {
      response.status(200);
      response.json(info);
    });

    /* fire the app */
    app.start(function (error, env) {
      console.log(
        `visit http://0.0.0.0:${env.PORT}/v${info.version}/services`
      );
    });

  });

}

boot();