'use strict';


/**
 * @name majifix-service
 * @description A representation of an acceptable 
 * service (request types)(e.g Water Leakage) offered(or handled) 
 * by a specific jurisdiction.
 * 
 * @author Benson Maruchu <benmaruchu@gmail.com>
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const { app } = require('majifix-service');
 *
 * ...
 *
 * app.start();
 *
 */


/* dependencies */
const path = require('path');
const app = require('@lykmapipo/express-common');


/* import models */
const Service =
  require(path.join(__dirname, 'lib', 'service.model'));


/* import routers*/
const router =
  require(path.join(__dirname, 'lib', 'http.router'));


/* export service model */
exports.Service = Service;


/* export service router */
exports.router = router;


/* export app */
Object.defineProperty(exports, 'app', {
  get() {

    //TODO bind oauth middlewares authenticate, token, authorize

    /* bind service router */
    app.mount(router);
    return app;
  }

});