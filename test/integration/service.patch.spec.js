'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
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

  describe('static patch', () => {

    let service;

    before(done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service
        .post((error, created) => {
          service = created;
          done(error, created);
        });
    });

    it('should be able to patch', done => {

      service = service.fakeOnly('name');

      Service
        .patch(service._id, service, (error, updated) => {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          expect(updated.name.en).to.eql(service.name.en);
          done(error, updated);
        });
    });

    it('should throw if not exists', done => {

      const fake = Service.fake().toObject();

      Service
        .patch(fake._id, _.omit(fake, '_id'), (error, updated) => {
          expect(error).to.exist;
          // expect(error.status).to.exist;
          expect(error.name).to.be.equal('DocumentNotFoundError');
          expect(updated).to.not.exist;
          done();
        });
    });

  });

  describe('instance patch', () => {

    let service;

    before(done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service
        .post((error, created) => {
          service = created;
          done(error, created);
        });
    });

    it('should be able to patch', done => {
      service = service.fakeOnly('name');

      service
        .patch((error, updated) => {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          expect(updated.name.en).to.eql(service.name.en);
          done(error, updated);
        });
    });

    it('should throw if not exists', done => {
      service
        .patch((error, updated) => {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          done();
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
