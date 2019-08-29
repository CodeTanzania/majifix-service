import request from 'supertest';
import { app, mount } from '@lykmapipo/express-common';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { Service, apiVersion, serviceRouter } from '../../src';

describe('Service', () => {
  mount(serviceRouter);

  describe('Rest API', () => {
    let service;
    const jurisdiction = Jurisdiction.fake();
    const priority = Priority.fake();
    const group = ServiceGroup.fake();
    const type = Predefine.fake();

    before(done => clear(done));

    before(done => create(jurisdiction, priority, group, type, done));

    it('should handle HTTP POST on /services', done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.type = type;
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

          // assert payload
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

    after(done => clear(done));
  });
});
