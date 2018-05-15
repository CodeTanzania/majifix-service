'use strict';


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


/**
 * @apiDefine JWTError
 * @apiError  JWTExpired Authorization token has expired
 */


/**
 * @apiDefine AuthorizationHeaderError
 * @apiError  AuthorizationHeaderRequired  Authorization header is required
 */


/**
 * @apiDefine AuthorizationHeaderErrorExample
 * @apiErrorExample   {json} Error-Response:
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "success":false,
 *      "message :"Authorization header required",
 *      "error":{}
 *    }
 */


/**
 * @apiDefine JWTErrorExample
 * @apiErrorExample  {json}   Error-Response:
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "success":false,
 *      "message :"jwt expired",
 *      "error":{}
 *    }
 */


/**
 * @apiDefine ServiceRequestHeader
 * @apiHeader {String} [Accept=application/json] Accepted content type
 * @apiHeader {String} Authorization Authorization token
 * @apiHeader {String} [Accept-Encoding='gzip, deflate'] Accepted encoding type
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 *
 */


/**
 * @apiDefine ServiceRequestHeaderExample
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Accept": "application/json"
 *     "Authorization": "Bearer ey6utFreRdy5"
 *     "Accept-Encoding": "gzip, deflate"
 *   }
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */



/* dependencies */
const path = require('path');
const _ = require('lodash');
const Router = require('@lykmapipo/express-common').Router;


/* local constants */
const API_VERSION = process.env.API_VERSION || '1.0.0';
const PATH_LIST = '/services';
const PATH_SINGLE = '/services/:id';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/services';


/* declarations */
const Service = require(path.join(__dirname, 'service.model'));
const router = new Router({
  version: API_VERSION
});



/**
 * @api {get} /services List Services
 * @apiVersion 0.1.0
 * @apiName GetServices
 * @apiGroup Service
 * @apiDescription Returns a list of services
 * @apiUse ServiceRequestHeader
 * @apiUse Services
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_LIST, function getServices(request, response, next) {

  //obtain request options
  const options = _.merge({}, request.mquery);

  Service
    .get(options, function onGetServices(error, results) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(results);
      }

    });

});



/**
 * @api {post} /services Create New Service
 * @apiVersion 0.1.0
 * @apiName PostService
 * @apiGroup Service
 * @apiDescription Create new service
 * @apiUse ServiceRequestHeader
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(PATH_LIST, function postService(request, response, next) {

  //obtain request body
  const body = _.merge({}, request.body);

  Service
    .post(body, function onPostService(error, created) {

      //forward error
      if (error) {
        console.log(error);
        next(error);
      }

      //handle response
      else {
        response.status(201);
        response.json(created);
      }

    });

});



/**
 * @api {get} /services/:id Get Existing Service
 * @apiVersion 0.1.0
 * @apiName GetService
 * @apiGroup Service
 * @apiDescription Get existing service
 * @apiUse ServiceRequestHeader
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_SINGLE, function getService(request, response, next) {

  //obtain request options
  const options = _.merge({}, request.mquery);

  //obtain service id
  options._id = request.params.id;

  Service
    .getById(options, function onGetService(error, found) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(found);
      }

    });

});


/**
 * @api {patch} /services/:id Patch Existing Service
 * @apiVersion 0.1.0
 * @apiName PatchService
 * @apiGroup Service
 * @apiDescription Patch existing service
 * @apiUse ServiceRequestHeader
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(PATH_SINGLE, function patchService(request, response, next) {

  //obtain service id
  const { id } = request.params;

  //obtain request body
  const patches = _.merge({}, request.body);

  Service
    .patch(id, patches, function onPatchService(error, patched) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(patched);
      }

    });

});



/**
 * @api {put} /services/:id Put Existing Service
 * @apiVersion 0.1.0
 * @apiName PutService
 * @apiGroup Service
 * @apiDescription Put existing service
 * @apiUse ServiceRequestHeader
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(PATH_SINGLE, function putService(request, response, next) {

  //obtain service id
  const { id } = request.params;

  //obtain request body
  const updates = _.merge({}, request.body);

  Service
    .put(id, updates, function onPutService(error, updated) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(updated);
      }

    });

});



/**
 * @api {delete} /services/:id Delete Existing Service
 * @apiVersion 0.1.0
 * @apiName DeleteService
 * @apiGroup Service
 * @apiDescription Delete existing service
 * @apiUse ServiceRequestHeader
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(PATH_SINGLE, function deleteService(request, response, next) {

  //obtain service id
  const { id } = request.params;

  Service
    .del(id, function onDeleteService(error, deleted) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(deleted);
      }

    });

});



/**
 * @api {get} /jurisdictions/:jurisdiction/services List Jurisdiction Services
 * @apiVersion 0.1.0
 * @apiName GetJurisdictionServices
 * @apiGroup Service
 * @apiDescription Returns a list of services of specified jurisdiction
 * @apiUse ServiceRequestHeader
 * @apiUse Services
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v0.1.0/jurisdictions/:jurisdiction/services
 *
 * @apiUse ServiceRequestHeaderExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_JURISDICTION, function getServices(request, response, next) {

  //obtain request options
  const { jurisdiction } = request.params;
  const filter =
    (jurisdiction ? { filter: { jurisdiction: jurisdiction } } : {}); //TODO support parent and no jurisdiction
  const options =
    _.merge({}, filter, request.mquery);


  Service
    .get(options, function onGetServices(error, found) {

      //forward error
      if (error) {
        next(error);
      }

      //handle response
      else {
        response.status(200);
        response.json(found);
      }

    });

});



/* expose router */
module.exports = router;