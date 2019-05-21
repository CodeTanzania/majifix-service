'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const async = require('async');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Priority } = require('@codetanzania/majifix-priority');
const { Service } = require(path.join(__dirname, '..', '..'));

describe('Service', () => {

  let jurisdiction;
  let priority;
  let group;

  before(done => {
    Service.deleteMany(done);
  });

  before(done => {
    ServiceGroup.deleteMany(done);
  });

  before(done => {
    Priority.deleteMany(done);
  });

  before(done => {
    Jurisdiction.deleteMany(done);
  });

  before(done => {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post((error, created) => {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(done => {
    priority = Priority.fake();
    priority.jurisdiction = jurisdiction;
    priority.post((error, created) => {
      priority = created;
      done(error, created);
    });
  });

  before(done => {
    group = ServiceGroup.fake();
    group.jurisdiction = jurisdiction;
    group.post((error, created) => {
      group = created;
      done(error, created);
    });
  });

  describe('get', () => {

    let services;

    before(done => {
      const fakes =
        _.map(Service.fake(32), service => {
          return next => {
            service.jurisdiction = jurisdiction;
            service.group = group;
            service.priority = priority;
            service.post(next);
          };
        });
      async
        .parallel(fakes, (error, created) => {
          services = created;
          done(error, created);
        });
    });

    it('should be able to get without options', done => {

      Service
        .get((error, results) => {
          expect(error).to.not.exist;
          expect(results).to.exist;
          expect(results.data).to.exist;
          expect(results.data).to.have.length(10);
          expect(results.total).to.exist;
          expect(results.total).to.be.equal(32);
          expect(results.limit).to.exist;
          expect(results.limit).to.be.equal(10);
          expect(results.skip).to.exist;
          expect(results.skip).to.be.equal(0);
          expect(results.page).to.exist;
          expect(results.page).to.be.equal(1);
          expect(results.pages).to.exist;
          expect(results.pages).to.be.equal(4);
          expect(results.lastModified).to.exist;
          expect(_.maxBy(results.data, 'updatedAt').updatedAt)
            .to.be.at.most(results.lastModified);
          done(error, results);
        });

    });

    it('should be able to get with options', done => {

      const options = { page: 1, limit: 20 };
      Service
        .get(options, (error, results) => {
          expect(error).to.not.exist;
          expect(results).to.exist;
          expect(results.data).to.exist;
          expect(results.data).to.have.length(20);
          expect(results.total).to.exist;
          expect(results.total).to.be.equal(32);
          expect(results.limit).to.exist;
          expect(results.limit).to.be.equal(20);
          expect(results.skip).to.exist;
          expect(results.skip).to.be.equal(0);
          expect(results.page).to.exist;
          expect(results.page).to.be.equal(1);
          expect(results.pages).to.exist;
          expect(results.pages).to.be.equal(2);
          expect(results.lastModified).to.exist;
          expect(_.maxBy(results.data, 'updatedAt').updatedAt)
            .to.be.at.most(results.lastModified);
          done(error, results);
        });

    });


    it('should be able to search with options', done => {

      const options = { filter: { q: services[0].name.en } };
      Service
        .get(options, (error, results) => {
          expect(error).to.not.exist;
          expect(results).to.exist;
          expect(results.data).to.exist;
          expect(results.data).to.have.length.of.at.least(1);
          expect(results.total).to.exist;
          expect(results.total).to.be.at.least(1);
          expect(results.limit).to.exist;
          expect(results.limit).to.be.equal(10);
          expect(results.skip).to.exist;
          expect(results.skip).to.be.equal(0);
          expect(results.page).to.exist;
          expect(results.page).to.be.equal(1);
          expect(results.pages).to.exist;
          expect(results.pages).to.be.equal(1);
          expect(results.lastModified).to.exist;
          expect(_.maxBy(results.data, 'updatedAt').updatedAt)
            .to.be.at.most(results.lastModified);
          done(error, results);
        });

    });


    it('should parse filter options', done => {
      const options = { filter: { code: services[0].code } };
      Service
        .get(options, (error, results) => {
          expect(error).to.not.exist;
          expect(results).to.exist;
          expect(results.data).to.exist;
          expect(results.data).to.have.length.of.at.least(1);
          expect(results.total).to.exist;
          expect(results.total).to.be.at.least(1);
          expect(results.limit).to.exist;
          expect(results.limit).to.be.equal(10);
          expect(results.skip).to.exist;
          expect(results.skip).to.be.equal(0);
          expect(results.page).to.exist;
          expect(results.page).to.be.equal(1);
          expect(results.pages).to.exist;
          expect(results.pages).to.be.equal(1);
          expect(results.lastModified).to.exist;
          expect(_.maxBy(results.data, 'updatedAt').updatedAt)
            .to.be.at.most(results.lastModified);
          done(error, results);
        });

    });

  });

  after(done => {
    Service.deleteMany(done);
  });

  after(done => {
    ServiceGroup.deleteMany(done);
  });

  after(done => {
    Priority.deleteMany(done);
  });

  after(done => {
    Jurisdiction.deleteMany(done);
  });

});
