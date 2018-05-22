'use strict';


/**
 * @module sla
 * @description service level agreement schema
 * @author lally elias<lallyelias87@gmail.com>
 * @since  0.1.0
 * @version 0.1.0
 */


/* dependencies */
const { Schema } = require('mongoose');
const { schema } = require('majifix-common');


/* declarations */
const SCHEMA_OPTIONS = schema.SUB_DOC_SCHEMA_OPTIONS;


/**
 * @name SLASchema
 * @description Service Level Agreement schema
 * @type {Schema}
 */
const SlaSchema = new Schema({
  /**
   * @name ttr
   * @description time required in hours to resolve(mark as done)
   * a service request(issue)
   * @type {Object}
   * @since  0.1.0
   * @version 0.1.0
   */
  ttr: {
    type: Number,
    default: 0,
    fake: true
  }

}, SCHEMA_OPTIONS);


/* exports service level agreement schema */
module.exports = exports = SlaSchema;