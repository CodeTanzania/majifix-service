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
    Service.deleteMany(done);
  });

  before(function (done) {
    ServiceGroup.deleteMany(done);
  });

  before(function (done) {
    Priority.deleteMany(done);
  });

  before(function (done) {
    Jurisdiction.deleteMany(done);
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

  describe('static post', function () {

    let service;

    it('should be able to post', function (done) {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      Service
        .post(service, function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name.en).to.eql(service.name.en);
          expect(created.code).to.eql(service.code);
          done(error, created);
        });
    });

  });

  describe('instance post', function () {

    let service;

    it('should be able to post', function (done) {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service
        .post(function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name.en).to.eql(service.name.en);
          expect(created.code).to.eql(service.code);
          done(error, created);
        });
    });

  });

  after(function (done) {
    Service.deleteMany(done);
  });

  after(function (done) {
    ServiceGroup.deleteMany(done);
  });

  after(function (done) {
    Priority.deleteMany(done);
  });

  after(function (done) {
    Jurisdiction.deleteMany(done);
  });

});
