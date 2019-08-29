import _ from 'lodash';
import { getString } from '@lykmapipo/env';
import {
  getFor,
  schemaFor,
  downloadFor,
  getByIdFor,
  postFor,
  patchFor,
  putFor,
  deleteFor,
  Router,
} from '@lykmapipo/express-rest-actions';
import Service from './service.model';

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_OPEN_311 = '/open311/services.:ext?';
const PATH_SINGLE = '/services/:id';
const PATH_LIST = '/services';
const PATH_EXPORT = '/services/export';
const PATH_SCHEMA = '/services/schema/';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/services';

/**
 * @name ServiceHttpRouter
 * @namespace ServiceHttpRouter
 *
 * @description A representation of an acceptable
 * service (request types)(e.g Water Leakage) offered(or handled)
 * by a specific jurisdiction.
 *
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetServices
 * @memberof ServiceHttpRouter
 * @description Returns a list of services
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

/**
 * @name GetServiceSchema
 * @memberof ServiceHttpRouter
 * @description Returns service json schema definition
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Service.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportServices
 * @memberof ServiceHttpRouter
 * @description Export services as csv
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `services_exports_${Date.now()}.csv`;
      const readStream = Service.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name GetOpen311Services
 * @memberof ServiceHttpRouter
 * @description Returns a list of services in open311 format
 * @todo improve documentation
 */
router.get(PATH_OPEN_311, function getServices(request, response, next) {
  // obtain request options
  let options = _.merge({}, request.mquery, {
    filter: { 'flags.external': true },
  });

  // obtain provided jurisdiction criteria
  const jurisdiction = _.get(request, 'query.jurisdiction_id');

  // merge & clean options
  if (!_.isEmpty(jurisdiction)) {
    options = _.merge({}, options, { filter: { jurisdiction } });
  }
  options = _.omitBy(options, _.isUndefined);

  Service.get(options, function onGetServices(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);

      // map services to open311 compliant service list
      const services = _.map(results.data, function cb(service) {
        return service.toOpen311();
      });

      response.json(services);
    }
  });
});

/**
 * @name PostService
 * @memberof ServiceHttpRouter
 * @description Create new service
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Service.post(body, done),
  })
);

/**
 * @name GetService
 * @memberof ServiceHttpRouter
 * @description Get existing service
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Service.getById(options, done),
  })
);

/**
 * @name PatchService
 * @memberof ServiceHttpRouter
 * @description Patch existing service
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Service.patch(options, done),
  })
);

/**
 * @name PutService
 * @memberof ServiceHttpRouter
 * @description Put existing service
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Service.put(options, done),
  })
);

/**
 * @name DeleteService
 * @memberof ServiceHttpRouter
 * @description Delete existing service
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Service.del(options, done),
    soft: true,
  })
);

/**
 * @name GetJurisdictionServices
 * @memberof ServiceHttpRouter
 * @description Returns a list of services of specified jurisdiction
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

/* expose router */
export default router;
