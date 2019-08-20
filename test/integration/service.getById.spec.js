import _ from 'lodash';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import { Service } from '../../src';

describe('Service', () => {
  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();

  priority.jurisdiction = jurisdiction;
  group.jurisdiction = jurisdiction;
  let service;

  before(done => clear(Jurisdiction, Priority, ServiceGroup, Service, done));

  before(done => create(jurisdiction, done));

  before(done => create(priority, group, done));

  before(done => {
    service = Service.fake();

    service.jurisdiction = jurisdiction;
    service.priority = priority;
    service.group = group;

    create(service, done);
  });

  describe('get by id', () => {
    it('should be able to get an instance', done => {
      Service.getById(service._id, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(service._id);
        done(error, found);
      });
    });

    it('should be able to get with options', done => {
      const options = {
        _id: service._id,
        select: 'code',
      };

      Service.getById(options, (error, found) => {
        expect(error).to.not.exist;
        expect(found).to.exist;
        expect(found._id).to.eql(service._id);
        expect(found.code).to.exist;

        // ...assert selection
        const fields = _.keys(found.toObject());
        expect(fields).to.have.length(5);
        _.map(
          ['name', 'description', 'color', 'createdAt', 'updatedAt'],
          field => {
            expect(fields).to.not.include(field);
          }
        );

        done(error, found);
      });
    });

    it('should throw if not exists', done => {
      const fake = Service.fake();

      Service.getById(fake._id, (error, found) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(found).to.not.exist;
        done();
      });
    });
  });

  after(done =>
    clear('Jurisdiction', 'Priority', 'Service', 'ServiceGroup', done)
  );
});
