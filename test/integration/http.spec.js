'use strict';

/* dependencies */
const path = require('path');
const request = require('supertest');
const { expect } = require('chai');
const { env } = require('@codetanzania/majifix-common');
const { Jurisdiction } = require('majifix-jurisdiction');
const { ServiceGroup } = require('majifix-service-group');
const { Priority } = require('majifix-priority');
const { Service, app } = require(path.join(__dirname, '..', '..'));

describe('Service', function () {

  describe('Rest API', function () {

    let jurisdiction;
    let priority;
    let group;
    let service;

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

    it('should handle HTTP POST on /services', function (done) {

      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      request(app)
        .post(`/v${env.API_VERSION}/services`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(service)
        .expect(201)
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const created = response.body;

          expect(created._id).to.exist;
          expect(created.code).to.exist;
          expect(created.name.en).to.exist;

          done(error, response);

        });

    });

    it('should handle HTTP GET on /services', function (done) {

      request(app)
        .get(`/v${env.API_VERSION}/services`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (error, response) {
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

    it('should handle HTTP GET on /services/id:', function (done) {

      request(app)
        .get(`/v${env.API_VERSION}/services/${service._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const found = response.body;
          expect(found._id).to.exist;
          expect(found._id).to.be.equal(service._id.toString());
          expect(found.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP PATCH on /services/id:', function (done) {

      const patch = service.fakeOnly('name');

      request(app)
        .patch(`/v${env.API_VERSION}/services/${service._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(patch)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const patched = response.body;

          expect(patched._id).to.exist;
          expect(patched._id).to.be.equal(service._id.toString());
          expect(patched.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP PUT on /services/id:', function (done) {

      const put = service.fakeOnly('name');

      request(app)
        .put(`/v${env.API_VERSION}/services/${service._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(put)
        .expect(200)
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const puted = response.body;

          expect(puted._id).to.exist;
          expect(puted._id).to.be.equal(service._id.toString());
          expect(puted.name.en).to.be.equal(service.name.en);

          done(error, response);

        });

    });

    it('should handle HTTP DELETE on /services/:id', function (done) {

      request(app)
        .delete(`/v${env.API_VERSION}/services/${service._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (error, response) {
          expect(error).to.not.exist;
          expect(response).to.exist;

          const deleted = response.body;

          expect(deleted._id).to.exist;
          expect(deleted._id).to.be.equal(service._id.toString());
          expect(deleted.name.en).to.be.equal(service.name.en);

          done(error, response);

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

});
