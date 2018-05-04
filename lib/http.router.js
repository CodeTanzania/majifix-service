'use strict';


/**
 * @module majifix-service
 * @apiDefine Service  Service
 *
 * @apiDescription A representation of an acceptable 
 * service (request types)(e.g Water Leakage) offered(or handled) 
 * by a specific jurisdiction.
 *
 * @see {@link http://apidocjs.com/}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */


/**
 * @apiDefine Service
 * @apiSuccess {String} _id Unique service identifier
 * @apiSuccess {String} [jurisdiction = undefined] jurisdiction under
 * which this service belongs
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
 *
 */


/**
 * @apiDefine ServicesSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * 
 */


/**
 * @apiDefine ServiceRequestHeader
 *
 * @apiHeader {String} [Accept=application/json] Accepted content type
 * @apiHeader {String} Authorization Authorization token
 * @apiHeader {String} [Accept-Encoding='gzip, deflate'] Accepted encoding type
 *
 * @see {@link http://apidocjs.com/}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * 
 */


/**
 * @apiDefine ServiceRequestHeaderExample
 *
 * @apiHeaderExample {json} Header-Example:
 *   {
 *     "Accept": "application/json"
 *     "Authorization": "Bearer ey6utFreRdy5"
 *     "Accept-Encoding": "gzip, deflate"
 *   }
 *
 * @see {@link http://apidocjs.com/}
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


/* declarations */
const Service = require(path.join(__dirname, 'service.model'));
const router = new Router({
  version: API_VERSION
});


/* expose service model */
Object.defineProperty(router, 'Model', {
  get() {
    return Service;
  }
});



/**
 * @api {get} /services List Services
 * @apiVersion 1.0.0
 * @apiName GetServices
 * @apiGroup Service
 *
 * @apiDescription Returns a list of services
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Services
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServicesSuccessResponse
 *
 */
router.get('/services', function getServices(request, response, next) {

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
 * @apiVersion 1.0.0
 * @apiName PostService
 * @apiGroup Service
 *
 * @apiDescription Create new service
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServiceSuccessResponse
 *
 */
router.post('/services', function postService(request, response, next) {

  //obtain request body
  const body = _.merge({}, request.body);

  Service
    .post(body, function onPostService(error, created) {

      //forward error
      if (error) {
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
 * @apiVersion 1.0.0
 * @apiName GetService
 * @apiGroup Service
 *
 * @apiDescription Get existing service
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServiceSuccessResponse
 *
 */
router.get('/services/:id', function getService(request, response,
  next) {

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
 * @apiVersion 1.0.0
 * @apiName PatchService
 * @apiGroup Service
 *
 * @apiDescription Patch existing service
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServiceSuccessResponse
 *
 */
router.patch('/services/:id', function patchService(request, response,
  next) {

  //obtain service id
  const _id = request.params.id;

  //obtain request body
  const patches = _.merge({}, request.body);

  Service
    .patch(_id, patches, function onPatchService(error, patched) {

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
 * @apiVersion 1.0.0
 * @apiName PutService
 * @apiGroup Service
 *
 * @apiDescription Put existing service
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServiceSuccessResponse
 *
 */
router.put('/services/:id', function putService(request, response,
  next) {

  //obtain service id
  const _id = request.params.id;

  //obtain request body
  const updates = _.merge({}, request.body);

  Service
    .put(_id, updates, function onPutService(error, updated) {

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
 * @apiVersion 1.0.0
 * @apiName DeleteService
 * @apiGroup Service
 *
 * @apiDescription Delete existing service
 *
 * @apiUse ServiceRequestHeader
 *
 * @apiUse Service
 *
 * @apiExample {curl} curl:
 *   curl -i https://majifix-service.herokuapp.com/v1.0.0/services
 *
 * @apiUse ServiceRequestHeaderExample
 *
 * @apiUse ServiceSuccessResponse
 *
 */
router.delete('/services/:id', function deleteService(request,
  response, next) {

  //obtain service id
  const _id = request.params.id;

  Service
    .del(_id, function onDeleteService(error, deleted) {

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


/* expose router */
module.exports = router;