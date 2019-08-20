/**
 * @apiDefine Service  Service
 *
 * @apiDescription A representation of an acceptable
 * service (request types)(e.g Water Leakage) offered(or handled)
 * by a specific jurisdiction.
 *
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */

/**
 * @apiDefine Service
 * @apiSuccess {String} _id Unique service identifier
 * @apiSuccess {String} [jurisdiction = undefined] jurisdiction under
 * which this service belongs
 * @apiSuccess {String} [group = undefined] service group under which this
 * service belongs
 * @apiSuccess {String} [type = undefined] service type under which this
 * service belongs
 * @apiSuccess {String} [priority = undefined]  A default priority
 * of the service. It assigned to service request if no priority set.
 * @apiSuccess {String} code A unique identifier of the service
 * @apiSuccess {Object} name
 * @apiSuccess {String} name.en A unique human readable name of
 * the service (request type) e.g Water Leakage.
 * @apiSuccess {Object} description
 * @apiSuccess {String} description.en A detailed human readable
 * explanation about the service(request type).
 * @apiSuccess {String} color A color code(in hexadecimal format)
 * eg. #363636 used to differentiate a service visually from
 * other service.
 * @apiSuccess {Date} createdAt Date when service was created
 * @apiSuccess {Date} updatedAt Date when service was last updated
 *
 */

/**
 * @apiDefine Services
 * @apiSuccess {Object[]} data List of services
 * @apiSuccess {String} data._id Unique service identifier
 * @apiSuccess {String} [data.jurisdiction = undefined] jurisdiction under
 * which this service belongs
 * @apiSuccess {String} [data.group = undefined] service group under which this
 * service belongs
 * @apiSuccess {String} [data.type = undefined] service type under which this
 * service belongs
 * @apiSuccess {String} [data.priority = undefined]  A default priority
 * of the service. It assigned to service request if no priority set.
 * @apiSuccess {String} data.code A unique identifier of the service
 * @apiSuccess {Object} data.name
 * @apiSuccess {String} data.name.en A unique human readable name of
 * the service (request type) e.g Water Leakage.
 * @apiSuccess {Object} data.description
 * @apiSuccess {String} data.description.en A detailed human readable
 * explanation about the service(request type).
 * @apiSuccess {String} data.color A color code(in hexadecimal format)
 * eg. #363636 used to differentiate a service visually from
 * other service.
 * @apiSuccess {Date} data.createdAt Date when service was created
 * @apiSuccess {Date} data.updatedAt Date when service was last updated
 * @apiSuccess {Number} total Total number of service
 * @apiSuccess {Number} size Number of service returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest service
 * was last modified
 *
 */

/**
 * @apiDefine ServiceSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 *    {
 *       "_id": "5aefff461e0a5527eb1955bd",
 *       "jurisdiction": {
 *         "_id": "5af2fe3ea937a3238bd8e64b",
 *         "code": "66514685",
 *         "name": "Gana"
 *       },
 *       "group": {
 *         "_id": "5af2fe3ea937a3238bd8e64b",
 *         "code": "4685",
 *         "name": "Gana"
 *       },
 *       "type": {
 *         "_id": "5af2fe3ea937a3238bd8e74a",
 *         "name": { "en" : "Request" }
 *       },
 *       "code": "05817253",
 *       "name": {
 *         "en": "Rowe"
 *       },
 *       "description": {
 *         "en": "Eos aut non non delectus dolor eos".
 *       },
 *       "color": "#8ced78",
 *       "createdAt": "2018-05-07T07:24:54.490Z",
 *       "updatedAt": "2018-05-07T07:24:54.490Z"
 *    }
 */

/**
 * @apiDefine ServicesSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "data": [
 *     {
 *       "_id": "5aefff461e0a5527eb1955bd",
 *       "jurisdiction": {
 *         "_id": "5af2fe3ea937a3238bd8e64b",
 *         "code": "66514685",
 *         "name": "Gana"
 *       },
 *       "code": "05817253",
 *       "name": {
 *         "en": "Rowe"
 *       },
 *       "description": {
 *         "en": "Eos aut non non delectus dolor eos".
 *       },
 *       "color": "#8ced78",
 *       "createdAt": "2018-05-07T07:24:54.490Z",
 *       "updatedAt": "2018-05-07T07:24:54.490Z"
 *    }
 *   ],
 *   "total": 20,
 *   "size": 10,
 *   "limit": 10,
 *   "skip": 0,
 *   "page": 1,
 *   "pages": 2,
 *   "lastModified": "2018-05-07T07:22:43.771Z"
 * }
 */
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

/* declarations */
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /services List Services
 * @apiVersion 1.0.0
 * @apiName GetServices
 * @apiGroup Service
 * @apiDescription Returns a list of services
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

/**
 * @api {get} /services/schema Get Service Schema
 * @apiVersion 1.0.0
 * @apiName GetServiceSchema
 * @apiGroup Service
 * @apiDescription Returns service json schema definition
 * @apiUse RequestHeaders
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
 * @api {get} /services/export Export Services
 * @apiVersion 1.0.0
 * @apiName ExportServices
 * @apiGroup Service
 * @apiDescription Export services as csv
 * @apiUse RequestHeaders
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
 * @api {get} /open311/services List Services
 * @apiVersion 1.0.0
 * @apiName GetOpen311Services
 * @apiGroup Service
 * @apiDescription Returns a list of services in open311 format
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
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
 * @api {post} /services Create New Service
 * @apiVersion 1.0.0
 * @apiName PostService
 * @apiGroup Service
 * @apiDescription Create new service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Service.post(body, done),
  })
);

/**
 * @api {get} /services/:id Get Existing Service
 * @apiVersion 1.0.0
 * @apiName GetService
 * @apiGroup Service
 * @apiDescription Get existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Service.getById(options, done),
  })
);

/**
 * @api {patch} /services/:id Patch Existing Service
 * @apiVersion 1.0.0
 * @apiName PatchService
 * @apiGroup Service
 * @apiDescription Patch existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Service.patch(options, done),
  })
);

/**
 * @api {put} /services/:id Put Existing Service
 * @apiVersion 1.0.0
 * @apiName PutService
 * @apiGroup Service
 * @apiDescription Put existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Service.put(options, done),
  })
);

/**
 * @api {delete} /services/:id Delete Existing Service
 * @apiVersion 1.0.0
 * @apiName DeleteService
 * @apiGroup Service
 * @apiDescription Delete existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Service.del(options, done),
    soft: true,
  })
);

/**
 * @api {get} /jurisdictions/:jurisdiction/services List Jurisdiction Services
 * @apiVersion 1.0.0
 * @apiName GetJurisdictionServices
 * @apiGroup Service
 * @apiDescription Returns a list of services of specified jurisdiction
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

/* expose router */
export default router;
