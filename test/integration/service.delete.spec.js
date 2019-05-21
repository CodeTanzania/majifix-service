'use strict';

/* dependencies */
const path = require('path');
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

  describe('static delete', () => {

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

    it('should be able to delete', done => {
      Service
        .del(service._id, (error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', done => {
      Service
        .del(service._id, (error, deleted) => {
          expect(error).to.exist;
          // expect(error.status).to.exist;
          expect(error.name).to.be.equal('DocumentNotFoundError');
          expect(deleted).to.not.exist;
          done();
        });
    });

  });

  describe('instance delete', () => {

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

    it('should be able to delete', done => {
      service
        .del((error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', done => {
      service
        .del((error, deleted) => {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
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
