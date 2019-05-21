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

  describe('get by id', () => {

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

    it('should be able to get an instance', done => {
      Service
        .getById(service._id, (error, found) => {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(service._id);
          done(error, found);
        });
    });

    it('should be able to get with options', done => {

      const options = {
        _id: service._id,
        select: 'code'
      };

      Service
        .getById(options, (error, found) => {
          expect(error).to.not.exist;
          expect(found).to.exist;
          expect(found._id).to.eql(service._id);
          expect(found.code).to.exist;

          //...assert selection
          const fields = _.keys(found.toObject());
          expect(fields).to.have.length(5);
          _.map([
            'name',
            'description',
            'color',
            'createdAt',
            'updatedAt'
          ], field => {
            expect(fields).to.not.include(field);
          });


          done(error, found);
        });

    });

    it('should throw if not exists', done => {

      const service = Service.fake();

      Service
        .getById(service._id, (error, found) => {
          expect(error).to.exist;
          expect(error.status).to.exist;
          expect(error.message).to.be.equal('Not Found');
          expect(found).to.not.exist;
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
