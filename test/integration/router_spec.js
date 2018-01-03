'use strict';

/**
 * Service router specification
 *
 * @description :: Server-side router specification for Service
 */

//dependencies
const path = require('path');
const expect = require('chai').expect;
const faker = require('faker');
const request = require('supertest');
const bodyParser = require('body-parser');
const ServiceGroup = require('majifix-service-group')().model;
const router = require(path.join(__dirname, '..', '..', 'http', 'router'))();
const app = require('express')();


//  use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(router);

let service;
let serviceGroup;

describe('Service Router', function () {

  before(function (done) {
    serviceGroup = {
      name: faker.company.companyName(),
      description: faker.company.catchPhrase()
    };

    ServiceGroup.create(serviceGroup, function (error, created) {
      serviceGroup = created;
      done(error, created);
    });
  });

  it('should handle HTTP POST on /services', done => {

    service = {
      name: faker.company.companyName(),
      code: faker.random.alphaNumeric(4),
      description: faker.company.catchPhrase(),
      group: serviceGroup._id
    };

    request(app)
      .post('/services')
      .send(service)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const created = response.body;

        expect(created).to.exist;

        expect(created._id).to.exist;
        expect(created.code).to.exist;
        expect(created.name).to.be.equal(service.name);
        expect(created.code).to.be.equal(service.code);
        expect(created.group).to.be.eql(service.group.toString());


        service = created;

        done(error, response);
      });
  });

  it('should handle HTTP GET on /services/:id', done => {

    request(app)
      .get('/services/' + service._id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const found = response.body;

        expect(found).to.exist;

        expect(found._id).to.exist;
        expect(found._id).to.eql(service._id);

        expect(found.code).to.be.equal(service.code);
        expect(found.name).to.be.equal(service.name);

        done(error, response);

      });
  });

  it('should handle HTTP PUT on /services/:id', done => {

    const updates = {
      name: faker.company.companyName()
    };

    request(app)
      .put('/services/' + service._id)
      .send(updates)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;
        expect(updated).to.exist;

        expect(updated._id).to.exist;
        expect(updated._id).to.be.eql(service._id);

        expect(updated.code).to.be.equal(service.code);
        expect(updated.name).to.be.equal(updates.name);

        service = updated;

        done(error, response);

      });

  });

  it('should handle HTTP PATCH on /services/:id', done => {
    const updates = {
      name: faker.company.companyName()
    };

    request(app)
      .patch('/services/' + service._id)
      .send(updates)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;
        expect(updated).to.exist;

        expect(updated._id).to.exist;
        expect(updated._id).to.be.eql(service._id);

        expect(updated.code).to.be.equal(service.code);
        expect(updated.name).to.be.equal(updates.name);

        service = updated;

        done(error, response);

      });
  });

  it('should handle HTTP GET on /services', done => {
    request(app)
      .get('/services')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const {
          services,
          pages,
          count
        } = response.body;
        expect(pages).to.exist;
        expect(services).to.exist;
        expect(count).to.exist;

        //TODO more services response assertions

        done(error, response);

      });

  });

  it('should handle HTTP DELETE on /services/:id', done => {
    request(app)
      .delete('/services/' + service._id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, response) {

        expect(error).to.not.exist;
        expect(response).to.exist;

        const removed = response.body;
        expect(removed).to.exist;

        expect(removed._id).to.exist;
        expect(removed._id).to.be.eql(service._id);

        expect(removed.code).to.be.equal(service.code);
        expect(removed.name).to.be.equal(service.name);

        done(error, response);

      });
  });
});