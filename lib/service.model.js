'use strict';


/**
 * @module Service
 * @name Service
 * @description A representation of an acceptable 
 * service (request types)(e.g Water Leakage) offered(or handled) 
 * by a specific jurisdiction.
 * 
 * @requires https://github.com/CodeTanzania/majifix-jurisdiction
 * @requires https://github.com/CodeTanzania/majifix-priority
 * @see {@link https://github.com/CodeTanzania/majifix-jurisdiction|Jurisdiction}
 * @see {@link https://github.com/CodeTanzania/majifix-priority|Priority}
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 * const { Service }= require('majifix-service');
 *
 * ...
 *  
 * Service.findOne(<criteria>).exec(done);
 *
 * ...
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const randomColor = require('randomcolor');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const localize = require('mongoose-locale-schema');
const { Jurisdiction } = require('majifix-jurisdiction');
const { ServiceGroup } = require('majifix-service-group');
const { Priority } = require('majifix-priority');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


/* local constants */
const DEFAULT_LOCALE = (process.env.DEFAULT_LOCALE || 'en');
const LOCALES = [DEFAULT_LOCALE];
const MODEL_NAME = 'Service';
const OPTION_AUTOPOPULATE = {
  select: { code: 1, name: 1, color: 1 }
};
const OPTION_AUTOPOPULATES = [{
  path: 'jurisdiction',
  select: Jurisdiction.OPTION_AUTOPOPULATE.select
}, {
  path: 'group',
  select: ServiceGroup.OPTION_AUTOPOPULATE.select
}, {
  path: 'priority',
  select: Priority.OPTION_AUTOPOPULATE.select
}];


/* declarations */
const Sla = require(path.join(__dirname, 'sla.schema'));
let locales = _.get(process, 'env.LOCALES', '').split(',');
locales = ([].concat(LOCALES).concat(locales));
locales = _.compact(locales);
locales = _.uniq(locales);
locales = _.map(locales, function (locale) {
  let option = { name: locale };
  if (locale === DEFAULT_LOCALE) {
    option.required = true;
  }
  return option;
});


/**
 * @name ServiceSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
const ServiceSchema = new Schema({
  /**
   * @name jurisdiction
   * @description A jurisdiction underwhich a service (request type) is 
   * applicable.
   * 
   * If not available a service is applicable to all jurisdictions.
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {string} ref - referenced collection
   * @property {boolean} required - mark required
   * @property {boolean} autoset - allow to set id from full object
   * @property {boolean} exists - ensure ref exists before save
   * @property {object} autopopulate - jurisdiction population options
   * @property {boolean} index - ensure database index
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  jurisdiction: {
    type: ObjectId,
    ref: Jurisdiction.MODEL_NAME,
    // required: true,
    autoset: true,
    exists: true,
    // autopopulate: Jurisdiction.OPTION_AUTOPOPULATE,
    index: true,
  },


  /**
   * @name group
   * @description A service group underwhich a service belongs to
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {string} ref - referenced collection
   * @property {boolean} required - mark required
   * @property {boolean} autoset - allow to set id from full object
   * @property {boolean} exists - ensure ref exists before save
   * @property {object} autopopulate - jurisdiction population options
   * @property {boolean} index - ensure database index
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  group: {
    type: ObjectId,
    ref: ServiceGroup.MODEL_NAME,
    // required: true,
    autoset: true,
    exists: true,
    // autopopulate: ServiceGroup.OPTION_AUTOPOPULATE,
    index: true
  },


  /**
   * @name priority
   * @description A default priority of the service. 
   * It assigned to service request if no priority set.
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {string} ref - referenced collection
   * @property {boolean} autoset - allow to set id from full object
   * @property {boolean} exists - ensure ref exists before save
   * @property {object} autopopulate - jurisdiction population options
   * @property {boolean} index - ensure database index
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  priority: {
    type: ObjectId,
    ref: Priority.MODEL_NAME,
    autoset: true,
    exists: true,
    // autopopulate: Priority.OPTION_AUTOPOPULATE,
    index: true
  },


  /**
   * @name code
   * @description A unique identifier of the service.
   * 
   * Used in deriving code of the service request(issue) and 
   * internal usage.
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} required - mark required
   * @property {boolean} uppercase - force uppercasing
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  code: {
    type: String,
    trim: true,
    required: true,
    index: true,
    uppercase: true,
    searchable: true,
    fake: {
      generator: 'finance',
      type: 'account'
    }
  },


  /**
   * @name name
   * @description A unique human readable name of the service (request type) 
   * e.g Water Leakage.
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} required - mark required
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {array}  locales - list of supported locales
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  name: localize({
    type: String,
    trim: true,
    required: true,
    index: true,
    searchable: true,
    locales: locales,
    fake: {
      generator: 'commerce',
      type: 'productName'
    }
  }),


  /**
   * @name description
   * @description A detailed human readable explanation about the service 
   * (request type).
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {array}  locales - list of supported locales
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  description: localize({
    type: String,
    trim: true,
    index: true,
    searchable: true,
    locales: locales,
    fake: {
      generator: 'lorem',
      type: 'paragraph'
    }
  }),


  /**
   * @name color
   * @description A color (hexadecimal format) used to differentiate service 
   * request type visually from other service.
   * 
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} uppercase - force upper-casing
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  color: {
    type: String,
    trim: true,
    uppercase: true,
    default: function () { return randomColor().toUpperCase(); },
    fake: true
  },


  /**
   * @name sla
   * @description A service level agreement of the service
   * @type {object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  sla: Sla,

  /**
   * @name isExternal
   * @description Flag if a service can be reported by external channel 
   * i.e mobile app, USSD, public website, chat bot etc. 
   * 
   * Its also applicable when a jurisdiction will want generic
   * service to be exposed to public while maintaining specific 
   * services internally.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  isExternal: { //TODO make use of flags schema
    type: Boolean,
    default: false,
    // fake: true
  }

}, { timestamps: true, emitIndexErrors: true });



//Indexes

//ensure `unique` compound index on jurisdiction, code and name 
//to fix unique indexes on code and name in case they are used in more than
//one jurisdiction with different administration
_.forEach(locales, function (locale) {
  const field = `name.${locale.name}`;
  ServiceSchema.index({ jurisdiction: 1, code: 1, [field]: 1 }, { unique: true });
});



//Instances

/**
 * @name toOpen311
 * @description convert service instance to Open311 compliant schema
 * @return {Object} open311 compliant service instance
 * @private
 * @since 0.1.0
 * @version 0.1.0
 * @type {Function}
 */
ServiceSchema.methods.toOpen311 = function () {
  //TODO refactor to plugin
  //TODO get311Services: isExternal true
  /*jshint camelcase:false*/

  let as311 = {};

  // The unique identifier for the service request type
  as311.service_code = this.code;

  // The human readable name of the service request type
  as311.service_name = this.name;

  // A brief description of the service request type.
  as311.description = this.description || this.name;

  //Determines whether there are additional form fields for this service type.
  //Current we don't support additional form fields
  as311.metadata = false;

  // The service request ID(ticket number) will be returned immediately after
  // the service request is submitted.
  as311.type = 'realtime';

  // A comma separated list of tags or keywords to help users identify
  // the request type. This can provide synonyms of the service_name and group.
  as311.keywords =
    _.compact([this.name, (this.group || {}).name]).join(',');

  // A category to group this service type within.
  // This provides a way to group several service request types under
  // one category such as "sanitation"
  as311.group = (this.group || {}).name;

  /*jshint camelcase:true*/

  return as311;

};



//Hooks

/**
 * @name  preValidate
 * @description run custom logics before validations
 * @return {Fuction} next a callback invoked after pre validate
 * @type {Function}
 */
ServiceSchema.pre('validate', function (next) {

  //set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = randomColor();
  }

  //ensure jurisdiction from service group
  const jurisdiction = _.get(this.group, 'jurisdiction');
  if (!this.jurisdiction && jurisdiction) {
    this.jurisdiction = jurisdiction;
  }

  //set service code
  if (_.isEmpty(this.code) && !_.isEmpty(this.name)) {

    //generate code from service group name
    this.code = _.take(this.name, 1).join('').toUpperCase();

  }

  next();

});



/* Instance */

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete service logics
 * @param  {Function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
ServiceSchema.methods.beforeDelete = function beforeDelete(done) {
  //TODO prevent delete if
  //1...there are service request use the service
  done();
};


/**
 * @name afterPost
 * @function afterPost
 * @description post save service logics
 * @param  {Function} done callback to invoke on success or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
ServiceSchema.methods.afterPost = function afterPost(done) {
  //populate refs after post(save)
  _.forEach(OPTION_AUTOPOPULATES, function (population) {
    this.populate(population);
  }.bind(this));
  this.populate(done);
};



/* Plugins */

/* use mongoose rest actions*/
ServiceSchema.plugin(actions);



/* Statics */

/* expose model name */
ServiceSchema.statics.MODEL_NAME = MODEL_NAME;
ServiceSchema.statics.OPTION_AUTOPOPULATES = OPTION_AUTOPOPULATES;
ServiceSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;



/* export service model */
module.exports = mongoose.model(MODEL_NAME, ServiceSchema);