import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { create, clear, expect } from '@lykmapipo/mongoose-test-helpers';
import { Service } from '../../src';

describe('Service static delete', () => {
  before(done => clear(Jurisdiction, Priority, ServiceGroup, done));

  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();

  before(done => create(jurisdiction, priority, group, done));

  let service;

  before(done => {
    service = Service.fake();
    service.jurisdiction = jurisdiction;
    service.group = group;
    service.priority = priority;

    create(service, done);
  });

  it('should be able to delete', done => {
    Service.del(service._id, (error, deleted) => {
      expect(error).to.not.exist;
      expect(deleted).to.exist;
      expect(deleted._id).to.eql(service._id);
      done(error, deleted);
    });
  });

  it('should throw if not exists', done => {
    Service.del(service._id, (error, deleted) => {
      expect(error).to.exist;
      // expect(error.status).to.exist;
      expect(error.name).to.be.equal('DocumentNotFoundError');
      expect(deleted).to.not.exist;
      done();
    });
  });

  after(done => clear(Jurisdiction, Priority, ServiceGroup, done));
});

describe('Service instance delete', () => {
  before(done => clear(Jurisdiction, Priority, ServiceGroup, done));

  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();

  before(done => create(jurisdiction, priority, group, done));

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

  it('should be able to delete', done => {
    service.del((error, deleted) => {
      expect(error).to.not.exist;
      expect(deleted).to.exist;
      expect(deleted._id).to.eql(service._id);
      done(error, deleted);
    });
  });

  it('should throw if not exists', done => {
    service.del((error, deleted) => {
      expect(error).to.not.exist;
      expect(deleted).to.exist;
      expect(deleted._id).to.eql(service._id);
      done();
    });
  });

  after(done => clear(Jurisdiction, Priority, ServiceGroup, done));
});
