const _ = require('lodash');
const { waterfall } = require('async');
const { connect } = require('@lykmapipo/mongoose-common');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { Priority } = require('@codetanzania/majifix-priority');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Service } = require('../lib');

/* track seeding time */
let seedStart;
let seedEnd;

/* eslint-disable */
const log = (stage, error, results) => {
  if (error) {
    console.error(`${stage} seed error`, error);
  }

  if (results) {
    const val = _.isArray(results) ? results.length : results;
    console.info(`${stage} seed result`, val);
  }
};
/* eslint-enable */

connect(err => {
  if (err) {
    throw err;
  }

  waterfall(
    [
      function clearService(next) {
        Service.deleteMany(() => next());
      },

      function clearPriority(next) {
        Priority.deleteMany(() => next());
      },

      function clearJurisdiction(next) {
        Jurisdiction.deleteMany(() => next());
      },

      function clearServiceGroup(next) {
        ServiceGroup.deleteMany(() => next());
      },

      function seedJurisdiction(next) {
        const jurisdiction = Jurisdiction.fake();
        jurisdiction.post(next);
      },

      function seedPriority(jurisdiction, next) {
        const priority = Priority.fake();
        priority.jurisdiction = jurisdiction;
        priority.post((error, created) => {
          next(error, jurisdiction, created);
        });
      },

      function seedServiceGroup(jurisdiction, priority, next) {
        const group = ServiceGroup.fake();
        group.jurisdiction = jurisdiction;
        group.post((error, created) => {
          next(error, jurisdiction, priority, created);
        });
      },

      function seedService(jurisdiction, priority, group, next) {
        seedStart = Date.now();
        let services = Service.fake(50);

        services = _.forEach(services, service => {
          const sample = service;
          sample.jurisdiction = jurisdiction;
          sample.priority = priority;
          sample.group = group;
          sample.flags = { external: _.sample([true, false]) };
          return sample;
        });

        Service.create(services, next);
      },
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      seedEnd = Date.now();

      log('time', null, seedEnd - seedStart);
      log('final', error, results);
      process.exit(0);
    }
  );
});
