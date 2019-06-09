/* dependencies */
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

  before(done => clear(Jurisdiction, Priority, ServiceGroup, done));

  before(done => create(jurisdiction, done));

  before(done => create(priority, group, done));

  describe('static post', () => {
    it('should be able to post', done => {
      const service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      Service.post(service, (error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(service._id);
        expect(created.name.en).to.eql(service.name.en);
        expect(created.code).to.eql(service.code);
        done(error, created);
      });
    });
  });

  describe('instance post', () => {
    let service;

    it('should be able to post', done => {
      service = Service.fake();
      service.jurisdiction = jurisdiction;
      service.group = group;
      service.priority = priority;

      service.post((error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(service._id);
        expect(created.name.en).to.eql(service.name.en);
        expect(created.code).to.eql(service.code);
        done(error, created);
      });
    });
  });

  after(done => clear(Jurisdiction, Priority, ServiceGroup, Service, done));
});
