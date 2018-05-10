'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const { expect } = require('chai');
const { Service } = require(path.join(__dirname, '..', '..'));

describe.skip('Service', function () {

  before(function (done) {
    mongoose.connect('mongodb://localhost/majifix-service', done);
  });

  before(function (done) {
    Service.remove(done);
  });

  describe('get by id', function () {

    let service;

    before(function (done) {
      const fake = Service.fake();
      fake
        .post(function (error, created) {
          service = created;
          done(error, created);
        });
    });

    it('should be able to get an instance', function (done) {
      Service
        .getById(service._id, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(service._id);
          done(error, found);
        });
    });

    it('should be able to get with options', function (done) {

      const options = {
        _id: service._id,
        select: 'code'
      };

      Service
        .getById(options, function (error, found) {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(service._id);
          expect(found.code).to.exist;

          //...assert selection
          const fields = _.keys(found.toObject());
          expect(fields).to.have.length(2);
          _.map([
            'name',
            'description',
            'color',
            'createdAt',
            'updatedAt'
          ], function (field) {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', function (done) {
      const service = Service.fake();

      Service
        .getById(service._id, function (error, found) {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
          done();
        });
    });

  });

  after(function (done) {
    Service.remove(done);
  });

});