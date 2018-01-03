'use strict';

/**
 * @module majifix service
 * @version 0.1.0
 * @description majifix service library
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @public
 */

const path = require('path');
let mongoose = require('mongoose');
const _ = require('lodash');
const Model = require(path.join(__dirname, 'models', 'service'));
const serviceRouter = require(path.join(__dirname, 'http', 'router'));


module.exports = function (options) {

  options = _.merge({}, options);

  mongoose = _.get(options, 'mongoose', mongoose);

  const routerOptions = _.get(options, 'router', {});

  const Router = serviceRouter(routerOptions);

  return {
    model: Model,
    router: Router
  };
};