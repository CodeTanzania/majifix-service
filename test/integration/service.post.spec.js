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

  describe('static post', () => {

    let service;

    it('should be able to post', done => {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      Service
        .post(service, (error, created) => {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name.en).to.eql(service.name.en);
          expect(created.code).to.eql(service.code);
          done(error, created);
        });
    });

  });

  describe('instance post', () => {

    let service;

    it('should be able to post', done => {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service
        .post((error, created) => {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name.en).to.eql(service.name.en);
          expect(created.code).to.eql(service.code);
          done(error, created);
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
