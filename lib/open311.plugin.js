'use strict';


/**
 * @module open311
 * @name open311
 * @description open311 extensions for a service
 *
 * @see {@link http://wiki.open311.org/GeoReport_v2/}
 * @see {@link http://wiki.open311.org/GeoReport_v2/#get-service-list}
 *
 * @author lally elias<lallyelias87@gmail.com>
 * @since  0.1.0
 * @version 0.1.0
 */


/* dependencies */
const _ = require('lodash');
const { env } = require('@codetanzania/majifix-common');


/* constants */
const { DEFAULT_LOCALE } = env;


/* declarations */

/**
 * @name unlocalize
 * @description flat a given object to unlocalized object
 * @param {string} path prefix to used on unlocalized key
 * @param {object} data object to unlocalized
 * @return {object}
 *
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
function unlocalize(path, data) {

  // prepare unlocalized data
  let unlocalized = {};

  //prepare localized
  let localized =
    (data && _.isFunction(data.toObject) ? data.toObject() : data);
  localized = _.merge({}, localized);

  _.forEach(localized, function (value, locale) {

    //handle default locale
    if (locale === DEFAULT_LOCALE) {
      unlocalized[path] = value;
    }

    //handle other locales
    else {
      const key = `${path}_${locale}`;
      unlocalized[key] = value;
    }

  });

  //return unlocalized object
  return _.omitBy(unlocalized, _.isUndefined);

}


/* implementation */
module.exports = function open311Plugin(schema) {

  /**
   * @name toOpen311
   * @description convert service instance to Open311 compliant schema
   * @return {object} open311 compliant service instance
   *
   * @since 0.1.0
   * @version 0.1.0
   * @type {function}
   * @instance
   */
  schema.methods.toOpen311 = function () {

    /*jshint camelcase:false*/

    let object = {};

    // The unique identifier for the service request type
    object.service_code = this.code;

    // The human readable name of the service request type
    const name = unlocalize('service_name', this.name);
    object = _.merge({}, object, name);

    // A brief description of the service request type.
    const description = unlocalize('description', this.description);
    object = _.merge({}, object, description);

    //Determines whether there are additional form fields for this service type.
    //Current we don't support additional form fields
    object.metadata = false;

    // The service request ID(ticket number) will be returned immediately after
    // the service request is submitted.
    object.type = 'realtime';

    // A category to group this service type within.
    // This provides a way to group several service request types under
    // one category such as "sanitation"
    const group = unlocalize('group', (this.group || {}).name);
    object = _.merge({}, object, group);

    // A comma separated list of tags or keywords to help users identify
    // the request type. This can provide synonyms of the service_name and group.
    object.keywords = [].concat(_.values(name)).concat(_.values(group));
    object.keywords = _.chain(object.keywords).compact().uniq().join(',').value();

    /*jshint camelcase:true*/

    return object;

  };

};
