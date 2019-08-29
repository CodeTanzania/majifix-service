import { expect, create, clear } from '@lykmapipo/mongoose-test-helpers';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { Service } from '../../src';

describe('Service getOneOrDefault', () => {
  before(done => clear(done));

  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();

  priority.jurisdiction = jurisdiction;
  group.jurisdiction = jurisdiction;

  let service = Service.fake();
  service.default = true;
  service.jurisdiction = jurisdiction;
  service.group = group;
  service.priority = priority;

  before(done => create(jurisdiction, done));
  before(done => create(priority, group, done));

  before(done => {
    service.post((error, created) => {
      service = created;
      done(error, created);
    });
  });

  it('should be able to get existing by id', done => {
    const { _id } = service;
    Service.getOneOrDefault({ _id }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(service._id);
      done(error, found);
    });
  });

  it('should be able to get existing with criteria', done => {
    const name = service.name.en;
    Service.getOneOrDefault({ 'name.en': name }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(service._id);
      done(error, found);
    });
  });

  it('should be able to get default with criteria', done => {
    Service.getOneOrDefault({}, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(service._id);
      done(error, found);
    });
  });

  it('should not throw if not exists', done => {
    const { _id } = Service.fake();
    Service.getOneOrDefault({ _id }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      expect(found._id).to.eql(service._id);
      done(error, found);
    });
  });

  after(done => clear(done));
});
