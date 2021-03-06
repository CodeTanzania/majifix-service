import _ from 'lodash';
import { getString } from '@lykmapipo/env';

/* constants */
const DEFAULT_LOCALE = getString('DEFAULT_LOCALE', 'en');

/**
 * @name unlocalize
 * @description flat a given object to unlocalized object
 * @param {string} path prefix to used on unlocalized key
 * @param {object} data object to unlocalized
 * @returns {object} unlocalized path
 *
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
function unlocalize(path, data) {
  // prepare unlocalized data
  const unlocalized = {};

  // prepare localized
  let localized = data && _.isFunction(data.toObject) ? data.toObject() : data;
  localized = _.merge({}, localized);

  _.forEach(localized, function cb(value, locale) {
    // handle default locale
    if (locale === DEFAULT_LOCALE) {
      unlocalized[path] = value;
    }

    // handle other locales
    else {
      const key = `${path}_${locale}`;
      unlocalized[key] = value;
    }
  });

  // return unlocalized object
  return _.omitBy(unlocalized, _.isUndefined);
}

/* implementation */

/**
 * @function open311Plugin
 * @name open311Plugin
 * @description extend service request with open311 methods
 * @param {object} schema valid service request schema
 *
 * @since 0.1.0
 * @version 0.1.0
 */
export default function open311Plugin(schema) {
  /**
   * @name toOpen311
   * @description convert service instance to Open311 compliant schema
   * @returns {object} open311 compliant service instance
   *
   * @since 0.1.0
   * @version 0.1.0
   * @type {Function}
   * @instance
   */
  // eslint-disable-next-line no-param-reassign
  schema.methods.toOpen311 = function toOpen311() {
    let object = {};

    // The unique identifier for the service request type
    object.service_code = this.code;

    // The human readable name of the service request type
    const name = unlocalize('service_name', this.name);
    object = _.merge({}, object, name);

    // A brief description of the service request type.
    const description = unlocalize('description', this.description);
    object = _.merge({}, object, description);

    // Determines whether there are additional form fields for this service type.
    // Current we don't support additional form fields
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
    object.keywords = _.chain(object.keywords)
      .compact()
      .uniq()
      .join(',')
      .value();

    return object;
  };
}
