/* dependencies */
import _ from 'lodash';
import { expect } from 'chai';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { clear, create } from '@lykmapipo/mongoose-test-helpers';

import { Service } from '../../src';

describe('Service', () => {
  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();

  priority.jurisdiction = jurisdiction;
  group.jurisdiction = jurisdiction;

  before(done => clear(Priority, Jurisdiction, ServiceGroup, done));

  before(done => create(jurisdiction, done));

  before(done => create(priority, group, done));

  describe('static patch', () => {
    let service;

    before(done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      create(service, done);
    });

    it('should be able to patch', done => {
      service = service.fakeOnly('name');

      Service.patch(service._id, service, (error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(service._id);
        expect(updated.name.en).to.eql(service.name.en);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      const fake = Service.fake().toObject();

      Service.patch(fake._id, _.omit(fake, '_id'), (error, updated) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(updated).to.not.exist;
        done();
      });
    });
  });

  describe('instance patch', () => {
    let service;

    before(done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service.post((error, created) => {
        service = created;
        done(error, created);
      });
    });

    it('should be able to patch', done => {
      service = service.fakeOnly('name');

      service.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(service._id);
        expect(updated.name.en).to.eql(service.name.en);
        done(error, updated);
      });
    });

    it('should throw if not exists', done => {
      service.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(service._id);
        done();
      });
    });
  });

  after(done => clear(Jurisdiction, Priority, ServiceGroup, Service, done));
});
