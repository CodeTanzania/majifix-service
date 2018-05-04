'use strict';


/**
 * @module majifix-service
 * @name Service
 * @description A representation of an acceptable 
 * service (request types)(e.g Water Leakage) offered(or handled) 
 * by a specific jurisdiction.
 * 
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const randomColor = require('randomcolor');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


//TODO depend on jurisdiction, service group, priority


/* declarations */
const Sla = require(path.join(__dirname, 'sla.schema'));


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
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  jurisdiction: {
    type: ObjectId,
    ref: 'Jurisdiction',
    index: true,
    autoset: true,
    exists: true
  },


  /**
   * @name group
   * @description A service group underwhich a service belongs to
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  group: {
    type: ObjectId,
    ref: 'ServiceGroup',
    // required: true, //TODO why required?
    index: true,
    autoset: true,
    exists: true
  },


  /**
   * @name priority
   * @description A priority of the service. 
   * It assigned to service request if no priority set.
   * 
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  priority: { //TODO support optional population
    type: ObjectId,
    ref: 'Priority',
    autoset: true,
    exists: true,
    index: true
  },


  /**
   * @name code
   * @description A unique identifier of the service.
   * 
   * Used in deriving code of the service request(issue) and 
   * internal usage.
   * 
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  code: {
    type: String,
    // unique: true, see index section below for compound index
    // used to enforce uniqueness
    required: true,
    trim: true,
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
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  name: { //TODO use multi locale
    type: String,
    // unique: true, see index section below for compound index
    // used to enforce uniqueness
    required: true,
    trim: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'commerce',
      type: 'productName'
    }
  },


  /**
   * @name description
   * @description A detailed human readable explanation about the service 
   * (request type).
   * 
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  description: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'lorem',
      type: 'paragraph'
    }
  },


  /**
   * @name color
   * @description A color (hexadecimal format) used to differentiate service 
   * request type visually from other service.
   * 
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  color: {
    type: String,
    trim: true,
    uppercase: true,
    default: randomColor()
  },


  /**
   * @name sla
   * @description A service level agreement of the service
   * @type {Object}
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
   * @type {Object}
   * @private
   * @since 0.1.0
   * @version 0.1.0
   */
  isExternal: { //TODO make use of flags schema
    type: Boolean,
    default: false
  }

}, { timestamps: true, emitIndexErrors: true });



//Indexes

//ensure `unique` compound index on jurisdiction, group, name and code
//to fix unique indexes on code and name in case they are used in more than
//one jurisdiction with different administration
ServiceSchema.index({
  jurisdiction: 1,
  group: 1,
  name: 1,
  code: 1
}, {
  unique: true
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



//Plugins

/* use mongoose rest actions*/
ServiceSchema.plugin(actions);



/* export service model */
module.exports = mongoose.model('Service', ServiceSchema);