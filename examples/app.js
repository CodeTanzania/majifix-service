'use strict';

/* ensure mongo uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/majifix-service');


/* dependencies */
const path = require('path');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
// mongoose.set('debug', true);
const { mount, start } = require('@lykmapipo/express-common');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Priority } = require('@codetanzania/majifix-priority');
const { Service, apiVersion, info, app } = require(path.join(__dirname, '..'));
let samples = require('./samples')(20);


/* connect to mongoose */
mongoose.connect(process.env.MONGODB_URI);


function boot() {

  async.waterfall([

    function clearServices(next) {
      Service.remove(function ( /*error, results*/ ) {
        next();
      });
    },

    function clearPriorities(next) {
      Priority.remove(function ( /*error, results*/ ) {
        next();
      });
    },

    function clearServiceGroups(next) {
      ServiceGroup.remove(function ( /*error, results*/ ) {
        next();
      });
    },

    function clearJurisdictions(next) {
      Jurisdiction.remove(function ( /*error, results*/ ) {
        next();
      });
    },

    function seedJurisdictions(next) {
      const jurisdiction = Jurisdiction.fake();
      jurisdiction.post(next);
    },

    function seedServiceGroups(jurisdiction, next) {
      const servicegroup = ServiceGroup.fake();
      servicegroup.jurisdiction = jurisdiction;
      servicegroup.post(function (error, created) {
        next(error, jurisdiction, created);
      });
    },

    function seedPriorities(jurisdiction, group, next) {
      const priority = Priority.fake();
      priority.jurisdiction = jurisdiction;
      priority.post(function (error, created) {
        next(error, jurisdiction, group, created);
      });
    },

    function seedServices(jurisdiction, group, priority, next) {
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
    start(function (error, env) {
      console.log(
        `visit http://0.0.0.0:${env.PORT}/${apiVersion}/services`
      );
    });

  });

}

boot();
