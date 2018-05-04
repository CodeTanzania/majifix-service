'use strict';

/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const { expect } = require('chai');
const { Service } = require(path.join(__dirname, '..', '..'));

describe('Service', function () {

  before(function (done) {
    mongoose.connect('mongodb://localhost/majifix-service', done);
  });

  before(function (done) {
    Service.remove(done);
  });

  describe('static patch', function () {

    let service;

    before(function (done) {
      const fake = Service.fake();
      fake
        .post(function (error, created) {
          service = created;
          done(error, created);
        });
    });

    it('should be able to patch', function (done) {

      service = service.fakeOnly('name');

      Service
        .patch(service._id, service, function (error,
          updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          expect(updated.name).to.eql(service.name);
          done(error, updated);
        });
    });

    it('should throw if not exists', function (done) {

      const fake = Service.fake();

      Service
        .patch(fake._id, fake, function (error, updated) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(updated).to.not.exist;
          done();
        });
    });

  });

  describe('instance patch', function () {

    let service;

    before(function (done) {
      const fake = Service.fake();
      fake
        .post(function (error, created) {
          service = created;
          done(error, created);
        });
    });

    it('should be able to patch', function (done) {
      service = service.fakeOnly('name');

      service
        .patch(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          expect(updated.name).to.eql(service.name);
          done(error, updated);
        });
    });

    it('should throw if not exists', function (done) {
      service
        .patch(function (error, updated) {
          expect(error).to.not.exist;
          expect(updated).to.exist;
          expect(updated._id).to.eql(service._id);
          done();
        });
    });

  });

  after(function (done) {
    Service.remove(done);
  });

});