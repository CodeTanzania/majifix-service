import path from 'path';
import _ from 'lodash';
import { expect, create, clear } from '@lykmapipo/mongoose-test-helpers';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { Service } from '../../src';

describe('Service Seed', () => {
  const { SEEDS_PATH } = process.env;

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

  before(() => {
    process.env.SEEDS_PATH = path.join(__dirname, '..', 'fixtures');
  });

  before(done => Jurisdiction.seed(done));
  before(done => Priority.seed(done));
  before(done => ServiceGroup.seed(done));

  it('should be able to seed', done => {
    Service.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      service = _.first(seeded);
      done(error, seeded);
    });
  });

  it('should not throw if seed exist', done => {
    Service.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = service.toObject();
    Service.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = service.toObject();
    Service.seed([seed], (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if provided exist', done => {
    const seed = service.toObject();
    Service.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should be able to seed from environment', done => {
    Service.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if seed from environment exist', done => {
    Service.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  after(done => clear(done));

  after(() => {
    process.env.SEEDS_PATH = SEEDS_PATH;
  });
});
