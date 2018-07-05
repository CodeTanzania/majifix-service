'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Priority } = require('@codetanzania/majifix-priority');
const { Service } = require(path.join(__dirname, '..', '..'));

describe('Service', function () {

  let jurisdiction;
  let priority;
  let group;

  before(function (done) {
    Service.remove(done);
  });

  before(function (done) {
    ServiceGroup.remove(done);
  });

  before(function (done) {
    Priority.remove(done);
  });

  before(function (done) {
    Jurisdiction.remove(done);
  });

  before(function (done) {
    jurisdiction = Jurisdiction.fake();
    jurisdiction.post(function (error, created) {
      jurisdiction = created;
      done(error, created);
    });
  });

  before(function (done) {
    priority = Priority.fake();
    priority.jurisdiction = jurisdiction;
    priority.post(function (error, created) {
      priority = created;
      done(error, created);
    });
  });

  before(function (done) {
    group = ServiceGroup.fake();
    group.jurisdiction = jurisdiction;
    group.post(function (error, created) {
      group = created;
      done(error, created);
    });
  });

  describe('static delete', function () {

    let service;

    before(function (done) {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service
        .post(function (error, created) {
          service = created;
          done(error, created);
        });
    });

    it('should be able to delete', function (done) {
      Service
        .del(service._id, function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', function (done) {
      Service
        .del(service._id, function (error, deleted) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(deleted).to.not.exist;
          done();
        });
    });

  });

  describe('instance delete', function () {

    let service;

    before(function (done) {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;
      service
        .post(function (error, created) {
          service = created;
          done(error, created);
        });
    });

    it('should be able to delete', function (done) {
      service
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
          done(error, deleted);
        });
    });

    it('should throw if not exists', function (done) {
      service
        .del(function (error, deleted) {
          expect(error).to.not.exist;
          expect(deleted).to.exist;
          expect(deleted._id).to.eql(service._id);
          done();
        });
    });

  });

  after(function (done) {
    Service.remove(done);
  });

  after(function (done) {
    ServiceGroup.remove(done);
  });

  after(function (done) {
    Priority.remove(done);
  });

  after(function (done) {
    Jurisdiction.remove(done);
  });

});
