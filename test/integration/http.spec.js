'use strict';

/* dependencies */
const path = require('path');
const request = require('supertest');
const { expect } = require('chai');
const { Jurisdiction } = require('@codetanzania/majifix-jurisdiction');
const { ServiceGroup } = require('@codetanzania/majifix-service-group');
const { Priority } = require('@codetanzania/majifix-priority');
const { Service, apiVersion, app } = require(path.join(__dirname, '..', '..'));

describe('Service', () => {

  describe('Rest API', () => {

    let jurisdiction;
    let priority;
    let group;
    let service;

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

    it('should handle HTTP POST on /services', done => {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      request(app)
        .post(`/${apiVersion}/services`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(service)
        .expect(201)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const created = response.body;

          expect(created._id).to.exist;
          expect(created.code).to.exist;
          expect(created.name.en).to.exist;

          done(error, response);

        });

    });

    it('should handle HTTP GET on /services', done => {

      request(app)
        .get(`/${apiVersion}/services`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          //assert payload
          const result = response.body;
          expect(result.data).to.exist;
          expect(result.total).to.exist;
          expect(result.limit).to.exist;
          expect(result.skip).to.exist;
          expect(result.page).to.exist;
          expect(result.pages).to.exist;
          expect(result.lastModified).to.exist;
          done(error, response);

        });

    });

    it('should handle HTTP GET on /services/id:', done => {

      request(app)
        .get(`/${apiVersion}/services/${service._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const found = response.body;
          expect(found._id).to.exist;
          expect(found._id).to.be.equal(service._id.toString());
          expect(found.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP PATCH on /services/id:', done => {

      const patch = service.fakeOnly('name');

      request(app)
        .patch(`/${apiVersion}/services/${service._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(patch)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const patched = response.body;

          expect(patched._id).to.exist;
          expect(patched._id).to.be.equal(service._id.toString());
          expect(patched.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP PUT on /services/id:', done => {

      const put = service.fakeOnly('name');

      request(app)
        .put(`/${apiVersion}/services/${service._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(put)
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const updated = response.body;

          expect(updated._id).to.exist;
          expect(updated._id).to.be.equal(service._id.toString());
          expect(updated.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP DELETE on /services/:id', done => {

      request(app)
        .delete(`/${apiVersion}/services/${service._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const deleted = response.body;

          expect(deleted._id).to.exist;
          expect(deleted._id).to.be.equal(service._id.toString());
          expect(deleted.name.en).to.be.equal(service.name.en);

          done(error, response);

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

});
