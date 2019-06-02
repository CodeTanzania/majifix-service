/**
 * @module sla
 * @name sla
 * @description Defines the level of service expected from a specific
 * jurisdiction
 *
 * @see {@link https://en.wikipedia.org/wiki/Service-level_agreement}
 *
 * @author lally elias<lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 */

/* @todo years, months, days, hours */

/* dependencies */
import { Schema } from 'mongoose';
import { schema } from '@codetanzania/majifix-common';

/* declarations */
const { SUB_DOC_SCHEMA_OPTIONS } = schema;

/**
 * @name SlaSchema
 * @type {Schema}
 * @private
 */
const SlaSchema = new Schema(
  {
    /**
     * @name ttr
     * @description time required in hours to resolve(mark as done)
     * a service request(issue)
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} index - ensure database index
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    ttr: {
      type: Number,
      index: true,
      default: 0,
      fake: true,
    },
  },
  SUB_DOC_SCHEMA_OPTIONS
);

/* exports sla schema */
export default SlaSchema;
