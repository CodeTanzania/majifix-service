'use strict';


/**
 * @apiDefine ServiceGroup ServiceGroup
 * Provide ability to group service offered by a jurisdiction(s)
 * into meaningful categories e.g Sanitation
 * It provides a way to group several service request types (issues)
 * under meaningful categories such as Sanitation, Commercial, Billing,
 * Non-Commercial etc.
 */


//dependencies
const path = require('path');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const controller =
  require(path.join(__dirname, 'controller'));
const expressMquery = require('express-mquery').middleware;
const response = require('express-respond');



function serviceGroupRouter(options) {



  // ensure options
  options = _.merge({}, options);

  const defaultMiddlewares = [
    expressMquery({
      limit: 10,
      maxLimit: 1000
    }),
    response({
      types: 'json'
    })
  ]

  //   ensure all pre middlewares
  const optionsAllMiddlewares = _.get(options, 'pre', []);
  const preMiddlewares = _.compact(_.concat([], defaultMiddlewares,
    optionsAllMiddlewares));

  // ensure pre index middlewares
  const optionsIndexMiddlewares = _.get(options, 'preindex', []);
  const preIndexMiddlewares = _.compact(_.concat([], optionsIndexMiddlewares,
    controller.index));

  // ensure pre create middlewares
  const optionsCreateMiddlewares = _.get(options, 'preCreate', []);
  const preCreateMiddlewares = _.compact(_.concat([], optionsCreateMiddlewares,
    controller.create));

  // ensure pre show middlewares
  const optionsShowMiddlewares = _.get(options, 'preShow', []);
  const preShowMiddlewares = _.compact(_.concat([], optionsShowMiddlewares,
    controller.show));

  // ensure pre update middlewares
  const optionsUpdateMiddlewares = _.get(options, 'preUpdate', []);
  const preUpdateMiddlewares = _.compact(_.concat([], optionsUpdateMiddlewares,
    controller.update));

  // ensure pre delete middleware
  const optionsDeleteMiddlewares = _.get(options, 'preDelete', []);
  const preDeleteMiddlewares = _.compact(_.concat([], optionsDeleteMiddlewares,
    controller.destroy));


  // add specific middlewares to servicegroups router
  router.all('/servicegroups*', preMiddlewares);


  /**
   * @api {get} /servicegroups Get Service Groups
   * @apiGroup ServiceGroup
   * @apiName GetServiceGroups
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value i.e application/json
   * @apiHeader {String}      Authorization
   *        Authorization token
   *
   *
   * @apiExample Example Usage
   * curl -i http://dawasco.herokuapp.com/servicegroups
   *
   *
   * @apiSuccess {Object}       jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiSuccess {String}       code
   *        A unique identifier of the service group.
   *        Used in deriving code of the service request(issue)
   *        and internal jurisdiction usage i.e act as an issue identifier.
   * @apiSuccess {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiSuccess {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiSuccess {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided
   *        it will randomly generated, but it is not guarantee its visual appeal.
   * @apiSuccess {ObjectId}     _id
   *        Unique Service Group Id
   * @apiSuccess {Timestamp}    createdAt
   *        Service group creation date
   * @apiSuccess {Timestamp}    updatedAt
   *        Service group last updated date
   * @apiSuccess {String}       uri
   *        Service group URI
   * @apiSuccess {Number}       pages
   *        Number of results pages
   * @apiSuccess {Number}       count
   *        Number of Service groups results  in the current json response
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *     "servicegroups": [
   *       {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "C",
   *           "name": "Commercial",
   *           "description": "Commercial related service request(issue)",
   *           "color": "#06C947",
   *           "_id": "592029e6e8dd8e00048c184c",
   *           "createdAt": "2017-05-20T11:35:02.033Z",
   *           "updatedAt": "2017-05-20T11:35:02.033Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
   *       },
   *       {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "N",
   *           "name": "Non Commercial",
   *           "description": "Non commercial related service request(issue)",
   *           "color": "#960F1E",
   *           "_id": "592029e6e8dd8e00048c184d",
   *           "createdAt": "2017-05-20T11:35:02.054Z",
   *           "updatedAt": "2017-05-20T11:35:02.054Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184d"
   *       },
   *       {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "O",
   *           "name": "Other",
   *           "description": "Other related service request(issue)",
   *           "color": "#C8B1EF",
   *           "_id": "592029e6e8dd8e00048c184e",
   *           "createdAt": "2017-05-20T11:35:02.066Z",
   *           "updatedAt": "2017-05-20T11:35:02.066Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184e"
   *       }
   *    ],
   *    "pages": 1,
   *    "count": 3
   *   }
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError JWTExpired     Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   *
   */
  router.get('/servicegroups', preIndexMiddlewares);


  /**
   * @api {post} /servicegroups Create Service Group
   * @apiGroup ServiceGroup
   * @apiName PostServiceGroup
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value i.e application/json
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type i.e application/json
   *
   *
   * @apiParam {ObjectId}     jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiParam {String}       code
   *        A unique identifier of the service group.Used in deriving code of
   *        the service request(issue) and internal jurisdiction usage i.e act
   *        as an issue identifier.
   * @apiParam {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiParam {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiParam {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided it
   *        will randomly generated, but it is not guarantee its visual appeal.
   *
   *
   * @apiSuccess {Object}       jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiSuccess {String}       code
   *        A unique identifier of the service group.
   *        Used in deriving code of the service request(issue)
   *        and internal jurisdiction usage i.e act as an issue identifier.
   * @apiSuccess {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiSuccess {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiSuccess {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided
   *        it will randomly generated, but it is not guarantee its visual appeal.
   * @apiSuccess {ObjectId}     _id
   *        Unique Service Group Id
   * @apiSuccess {Timestamp}    createdAt
   *        Service group creation date
   * @apiSuccess {Timestamp}    updatedAt
   *        Service group last updated date
   * @apiSuccess {String}       uri
   *        Service group URI
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 201 Created
   *    {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "C",
   *           "name": "Commercial",
   *           "description": "Commercial related service request(issue)",
   *           "color": "#06C947",
   *           "_id": "592029e6e8dd8e00048c184c",
   *           "createdAt": "2017-05-20T11:35:02.033Z",
   *           "updatedAt": "2017-05-20T11:35:02.033Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
   *    }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError  JWTExpired                   Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.post('/servicegroups', preCreateMiddlewares);


  /**
 * @api {get} /servicegroups/:id Get Service Group
 * @apiGroup ServiceGroup
 * @apiName GetServiceGroup
 * @apiVersion 0.1.0
 *
 * @apiHeader {String}      Accept
 *        Accept value i.e application/json
 * @apiHeader {String}      Authorization
 *        Authorization token

 *
 * @apiParam {ObjectId}       id
 *        Unique Service Group  Id.
 *
 * @apiSuccess {Object}       jurisdiction
 *        A jurisdiction under which a service group is applicable.
 *        If not available a service group is applicable to all  jurisdictions.
 * @apiSuccess {String}       code
 *        A unique identifier of the service group.
 *        Used in deriving code of the service request(issue)
 *        and internal jurisdiction usage i.e act as an issue identifier.
 * @apiSuccess {String}       name
 *        A unique human readable name of the service group e.g Sanitation
 * @apiSuccess {String}       description
 *        A detailed human readable explanation about the service group.
 * @apiSuccess {String}       color
 *        A color code(in hexadecimal format) eg. #363636 used to differentiate
 *        a service group visually from other service group.  If not provided
 *        it will randomly generated, but it is not guarantee its visual appeal.
 * @apiSuccess {ObjectId}     _id
 *        Unique Service Group Id
 * @apiSuccess {Timestamp}    createdAt
 *        Service group creation date
 * @apiSuccess {Timestamp}    updatedAt
 *        Service group last updated date
 * @apiSuccess {String}       uri
 *        Service group URI
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *           "jurisdiction": {
 *               "code": "H",
 *               "name": "HQ",
 *               "phone": "255714999888",
 *               "email": "N/A",
 *               "domain": "dawasco.org",
 *               "_id": "592029e5e8dd8e00048c184b",
 *               "longitude": 0,
 *               "latitude": 0,
 *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
 *           },
 *           "code": "C",
 *           "name": "Commercial",
 *           "description": "Commercial related service request(issue)",
 *           "color": "#06C947",
 *           "_id": "592029e6e8dd8e00048c184c",
 *           "createdAt": "2017-05-20T11:35:02.033Z",
 *           "updatedAt": "2017-05-20T11:35:02.033Z",
 *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
 *    }
 *
 * @apiError  AuthorizationHeaderRequired  Authorization header is required
 *
 *
 * @apiErrorExample   {json} Error-Response:
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "success":false,
 *      "message :"Authorization header required",
 *      "error":{}
 *    }
 *
 * @apiError  JWTExpired                   Authorization token has expired
 *
 * @apiErrorExample  {json}   Error-Response:
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "success":false,
 *      "message :"jwt expired",
 *      "error":{}
 *    }
 */
  router.get('/servicegroups/:id', preShowMiddlewares);


  /**
   * @api {put} /servicegroups/:id Update(PUT) Service Group
   * @apiGroup ServiceGroup
   * @apiName PutServiceGroup
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value i.e application/json
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type i.e application/json
   *
   *
   * @apiParam {ObjectId}     jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiParam {String}       code
   *        A unique identifier of the service group.Used in deriving code of
   *        the service request(issue) and internal jurisdiction usage i.e act
   *        as an issue identifier.
   * @apiParam {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiParam {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiParam {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided it
   *        will randomly generated, but it is not guarantee its visual appeal.
   *
   *
   * @apiSuccess {Object}       jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiSuccess {String}       code
   *        A unique identifier of the service group.
   *        Used in deriving code of the service request(issue)
   *        and internal jurisdiction usage i.e act as an issue identifier.
   * @apiSuccess {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiSuccess {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiSuccess {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided
   *        it will randomly generated, but it is not guarantee its visual appeal.
   * @apiSuccess {ObjectId}     _id
   *        Unique Service Group Id
   * @apiSuccess {Timestamp}    createdAt
   *        Service group creation date
   * @apiSuccess {Timestamp}    updatedAt
   *        Service group last updated date
   * @apiSuccess {String}       uri
   *        Service group URI
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "C",
   *           "name": "Commercial",
   *           "description": "Commercial related service request(issue)",
   *           "color": "#06C947",
   *           "_id": "592029e6e8dd8e00048c184c",
   *           "createdAt": "2017-05-20T11:35:02.033Z",
   *           "updatedAt": "2017-05-20T11:35:02.033Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
   *    }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError  JWTExpired                   Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.put('/servicegroups/:id', preUpdateMiddlewares);


  /**
   * @api {patch} /servicegroups/:id Update(PATCH) Service Group
   * @apiGroup ServiceGroup
   * @apiName PatchServiceGroup
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value i.e application/json
   * @apiHeader {String}      Authorization
   *        Authorization token
   * @apiHeader {String}      Content-Type
   *        Sent content type i.e application/json
   *
   *
   * @apiParam {ObjectId}     jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiParam {String}       code
   *        A unique identifier of the service group.Used in deriving code of
   *        the service request(issue) and internal jurisdiction usage i.e act
   *        as an issue identifier.
   * @apiParam {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiParam {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiParam {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided it
   *        will randomly generated, but it is not guarantee its visual appeal.
   *
   *
   * @apiSuccess {Object}       jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiSuccess {String}       code
   *        A unique identifier of the service group.
   *        Used in deriving code of the service request(issue)
   *        and internal jurisdiction usage i.e act as an issue identifier.
   * @apiSuccess {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiSuccess {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiSuccess {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided
   *        it will randomly generated, but it is not guarantee its visual appeal.
   * @apiSuccess {ObjectId}     _id
   *        Unique Service Group Id
   * @apiSuccess {Timestamp}    createdAt
   *        Service group creation date
   * @apiSuccess {Timestamp}    updatedAt
   *        Service group last updated date
   * @apiSuccess {String}       uri
   *        Service group URI
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "C",
   *           "name": "Commercial",
   *           "description": "Commercial related service request(issue)",
   *           "color": "#06C947",
   *           "_id": "592029e6e8dd8e00048c184c",
   *           "createdAt": "2017-05-20T11:35:02.033Z",
   *           "updatedAt": "2017-05-20T11:35:02.033Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
   *    }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError  JWTExpired                   Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.patch('/servicegroups/:id', preUpdateMiddlewares);

  /**
   * @api {delete} /servicegroups/:id Delete Service Group
   * @apiGroup ServiceGroup
   * @apiName DeleteServiceGroup
   * @apiVersion 0.1.0
   *
   * @apiHeader {String}      Accept
   *        Accept value i.e application/json
   * @apiHeader {String}      Authorization
   *        Authorization token
   *
   * @apiParam {ObjectId}       id
   *        Unique Service Group  Id.
   *
   *
   * @apiSuccess {Object}       jurisdiction
   *        A jurisdiction under which a service group is applicable.
   *        If not available a service group is applicable to all  jurisdictions.
   * @apiSuccess {String}       code
   *        A unique identifier of the service group.
   *        Used in deriving code of the service request(issue)
   *        and internal jurisdiction usage i.e act as an issue identifier.
   * @apiSuccess {String}       name
   *        A unique human readable name of the service group e.g Sanitation
   * @apiSuccess {String}       description
   *        A detailed human readable explanation about the service group.
   * @apiSuccess {String}       color
   *        A color code(in hexadecimal format) eg. #363636 used to differentiate
   *        a service group visually from other service group.  If not provided
   *        it will randomly generated, but it is not guarantee its visual appeal.
   * @apiSuccess {ObjectId}     _id
   *        Unique Service Group Id
   * @apiSuccess {Timestamp}    createdAt
   *        Service group creation date
   * @apiSuccess {Timestamp}    updatedAt
   *        Service group last updated date
   * @apiSuccess {String}       uri
   *        Service group URI
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *           "jurisdiction": {
   *               "code": "H",
   *               "name": "HQ",
   *               "phone": "255714999888",
   *               "email": "N/A",
   *               "domain": "dawasco.org",
   *               "_id": "592029e5e8dd8e00048c184b",
   *               "longitude": 0,
   *               "latitude": 0,
   *               "uri": "https://dawasco.herokuapp.com/jurisdictions/592029e5e8dd8e00048c184b"
   *           },
   *           "code": "C",
   *           "name": "Commercial",
   *           "description": "Commercial related service request(issue)",
   *           "color": "#06C947",
   *           "_id": "592029e6e8dd8e00048c184c",
   *           "createdAt": "2017-05-20T11:35:02.033Z",
   *           "updatedAt": "2017-05-20T11:35:02.033Z",
   *           "uri": "https://dawasco.herokuapp.com/servicegroups/592029e6e8dd8e00048c184c"
   *    }
   *
   *
   * @apiError  AuthorizationHeaderRequired  Authorization header is required
   *
   *
   * @apiErrorExample   {json} Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"Authorization header required",
   *      "error":{}
   *    }
   *
   * @apiError  JWTExpired                   Authorization token has expired
   *
   * @apiErrorExample  {json}   Error-Response:
   *    HTTP/1.1 403 Forbidden
   *    {
   *      "success":false,
   *      "message :"jwt expired",
   *      "error":{}
   *    }
   */
  router.delete('/servicegroups/:id', preDeleteMiddlewares);

  return router;
}

/**
 * exports servicegroups router
 * @type {Function}
 */
module.exports = serviceGroupRouter;