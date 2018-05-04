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

  describe('static post', function () {

    let service;

    it('should be able to post', function (done) {

      service = Service.fake();

      Service
        .post(service, function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name).to.eql(service.name);
          expect(created.code).to.eql(service.code);
          done(error, created);
        });
    });

  });

  describe('instance post', function () {

    let service;

    it('should be able to post', function (done) {

      service = Service.fake();

      service
        .post(function (error, created) {
          expect(error).to.not.exist;
          expect(created).to.exist;
          expect(created._id).to.eql(service._id);
          expect(created.name).to.eql(service.name);
          expect(created.code).to.eql(service.code);
          done(error, created);
        });
    });

  });

  after(function (done) {
    Service.remove(done);
  });

});