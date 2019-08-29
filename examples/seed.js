const _ = require('lodash');
const { waterfall, parallel } = require('async');
const { connect, clear } = require('@lykmapipo/mongoose-common');
const { Predefine } = require('@lykmapipo/predefine');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Priority } = require('@codetanzania/majifix-priority');
const { Service } = require('../lib');

/* track seeding time */
let seedStart;
let seedEnd;

const log = (stage, error, results) => {
  if (error) {
    console.error(`${stage} seed error`, error);
  }

  if (results) {
    const val = _.isArray(results) ? results.length : results;
    console.info(`${stage} seed result`, val);
  }
};

const clearSeed = next =>
  clear(Service, ServiceGroup, Priority, Jurisdiction, Predefine, () => next());

const seedType = next => Predefine.fake().post(next);
const seedJurisdiction = next => Jurisdiction.fake().post(next);
const seedPriority = next => Priority.fake().post(next);
const seedGroup = next => ServiceGroup.fake().post(next);
const preSeed = next =>
  parallel(
    {
      type: seedType,
      jurisdiction: seedJurisdiction,
      priority: seedPriority,
      group: seedGroup,
    },
    next
  );

const seedService = ({ type, jurisdiction, priority, group }, next) => {
  let services = Service.fake(50);

  services = _.forEach(services, service => {
    service.set({ type, jurisdiction, priority, group });
    return service;
  });

  Service.create(services, next);
};

const seed = () => {
  seedEnd = Date.now();
  waterfall([clearSeed, preSeed, seedService], (error, results) => {
    if (error) {
      throw error;
    }
    seedEnd = Date.now();

    log('time', null, seedEnd - seedStart);
    log('final', error, results);
    process.exit(0);
  });
};

// connect and seed
connect(error => {
  if (error) {
    throw error;
  }
  seed();
});
