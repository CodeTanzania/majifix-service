import {
  clear as clearHttp,
  testRouter,
} from '@lykmapipo/express-test-helpers';
import {
  clear as clearDb,
  create,
  expect,
} from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { Service, serviceRouter } from '../../src';

describe('Service Rest API', () => {
  const type = Predefine.fake();
  const jurisdiction = Jurisdiction.fake();
  const priority = Priority.fake();
  const group = ServiceGroup.fake();
  const service = Service.fake();
  service.set({ jurisdiction, group, type, priority });

  const options = {
    pathSingle: '/services/:id',
    pathList: '/services',
    pathSchema: '/services/schema/',
    pathExport: '/services/export/',
  };

  before(done => clearDb(Service, ServiceGroup, Priority, done));
  before(done => clearDb(Jurisdiction, Predefine, done));

  before(() => clearHttp());

  before(done => create(type, jurisdiction, priority, group, done));

  it('should handle HTTP POST on /services', done => {
    const { testPost } = testRouter(options, serviceRouter);
    testPost({ ...service.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Service(body);
        expect(created._id).to.exist.and.be.eql(service._id);
        expect(created.code).to.exist.and.be.eql(service.code);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /services', done => {
    const { testGet } = testRouter(options, serviceRouter);
    testGet()
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        expect(body.data).to.exist;
        expect(body.total).to.exist;
        expect(body.limit).to.exist;
        expect(body.skip).to.exist;
        expect(body.page).to.exist;
        expect(body.pages).to.exist;
        expect(body.lastModified).to.exist;
        done(error, body);
      });
  });

  it('should handle GET /services/schema', done => {
    const { testGetSchema } = testRouter(options, serviceRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /services/export', done => {
    const { testGetExport } = testRouter(options, serviceRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /services/:id', done => {
    const { testGet } = testRouter(options, serviceRouter);
    const params = { id: service._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Service(body);
        expect(found._id).to.exist.and.be.eql(service._id);
        expect(found.code).to.exist.and.be.eql(service.code);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /services/:id', done => {
    const { testPatch } = testRouter(options, serviceRouter);
    const { description } = service.fakeOnly('description');
    const params = { id: service._id.toString() };
    testPatch(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Service(body);
        expect(patched._id).to.exist.and.be.eql(service._id);
        expect(patched.code).to.exist.and.be.eql(service.code);
        done(error, body);
      });
  });

  it('should handle HTTP PUT on /services/:id', done => {
    const { testPut } = testRouter(options, serviceRouter);
    const { description } = service.fakeOnly('description');
    const params = { id: service._id.toString() };
    testPut(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Service(body);
        expect(patched._id).to.exist.and.be.eql(service._id);
        expect(patched.code).to.exist.and.be.eql(service.code);
        done(error, body);
      });
  });

  it('should handle HTTP DELETE on /services/:id', done => {
    const { testDelete } = testRouter(options, serviceRouter);
    const params = { id: service._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Service(body);
        expect(patched._id).to.exist.and.be.eql(service._id);
        expect(patched.code).to.exist.and.be.eql(service.code);
        done(error, body);
      });
  });

  after(() => clearHttp());

  after(done => clearDb(Service, ServiceGroup, Priority, done));
  after(done => clearDb(Jurisdiction, Predefine, done));
});
