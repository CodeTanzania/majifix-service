import { randomColor, idOf, mergeObjects, compact, pkg } from '@lykmapipo/common';
import { getString, apiVersion as apiVersion$1 } from '@lykmapipo/env';
export { start } from '@lykmapipo/express-common';
import _ from 'lodash';
import { createSubSchema, model, createSchema, ObjectId } from '@lykmapipo/mongoose-common';
import { localizedIndexesFor, localize, localizedValuesFor, localizedKeysFor } from 'mongoose-locale-schema';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { MODEL_NAME_SERVICE, checkDependenciesFor, POPULATION_MAX_DEPTH, COLLECTION_NAME_SERVICE, MODEL_NAME_SERVICEREQUEST, PATH_NAME_SERVICE } from '@codetanzania/majifix-common';
import { Predefine } from '@lykmapipo/predefine';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import { Router, getFor, schemaFor, downloadFor, postFor, getByIdFor, patchFor, putFor, deleteFor } from '@lykmapipo/express-rest-actions';

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
const SlaSchema = createSubSchema({
  /**
   * @name ttr
   * @description time required in hours to resolve(mark as done)
   * a service request(issue)
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} index - ensure database index
   * @property {boolean} exportable - allow field to be exported
   * @property {boolean} default - default value set when none provided
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  ttr: {
    type: Number,
    index: true,
    exportable: true,
    default: 0,
    fake: true,
  },
});

/**
 * @module flags
 * @name flags
 * @description Common service flags used to mark a special requirement or
 * treatment for a service. e.g service may be requiring customer account for
 * it to have valid information.
 *
 * @author lally elias<lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 */
const FlagsSchema = createSubSchema({
  /**
   * @name external
   * @description Flag if a service can be reported via external(or public)
   * channels i.e mobile app, USSD, public website, chat bot etc.
   *
   * Its also applicable when a jurisdiction will want generic service to be
   * exposed to public while maintaining specific services internally.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} index - ensure database index
   * @property {boolean} exportable - allow field to be exported
   * @property {boolean} default - default value set when none provided
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  external: {
    type: Boolean,
    index: true,
    exportable: true,
    default: false,
    fake: true,
  },

  /**
   * @name account
   * @description Flag if a service requires an account for it to be
   * handled. e.g billing service request may require a customer
   * account number.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} index - ensure database index
   * @property {boolean} exportable - allow field to be exported
   * @property {boolean} default - default value set when none provided
   * @property {object} fake - fake data generator options
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  account: {
    type: Boolean,
    index: true,
    exportable: true,
    default: false,
    fake: true,
  },
});

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
function open311Plugin(schema) {
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

/* constants */
const DEFAULT_LOCALE$1 = getString('DEFAULT_LOCALE', 'en');
const OPTION_SELECT = {
  jurisdiction: 1,
  group: 1,
  priority: 1,
  code: 1,
  name: 1,
  color: 1,
};
const OPTION_AUTOPOPULATE = {
  select: OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};
const SCHEMA_OPTIONS = { collection: COLLECTION_NAME_SERVICE };
const INDEX_UNIQUE = {
  jurisdiction: 1,
  code: 1,
  ...localizedIndexesFor('name'),
};

/**
 * @module Service
 * @name Service
 * @description A representation of an acceptable
 * service (request types)(e.g Water Leakage) offered(or handled)
 * by a specific jurisdiction.
 *
 * @requires https://github.com/CodeTanzania/majifix-jurisdiction
 * @requires https://github.com/CodeTanzania/majifix-priority
 * @requires https://github.com/CodeTanzania/majifix-service-group
 * @see {@link https://github.com/CodeTanzania/majifix-jurisdiction|Jurisdiction}
 * @see {@link https://github.com/CodeTanzania/majifix-priority|Priority}
 * @see {@link https://github.com/CodeTanzania/majifix-service-group|ServiceGroup}
 *
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
const ServiceSchema = createSchema(
  {
    /**
     * @name jurisdiction
     * @description A jurisdiction under which a service (request type)
     * is applicable.
     *
     * If not available a service is applicable to all jurisdictions.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {string} ref - referenced collection
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
      exists: { refresh: true, select: Jurisdiction.OPTION_SELECT },
      autopopulate: Jurisdiction.OPTION_AUTOPOPULATE,
      index: true,
    },

    /**
     * @name group
     * @description A service group under which a service belongs to
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {string} ref - referenced collection
     * @property {boolean} required - mark required
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
      required: true,
      exists: { refresh: true, select: ServiceGroup.OPTION_SELECT },
      autopopulate: ServiceGroup.OPTION_AUTOPOPULATE,
      index: true,
    },

    /**
     * @name type
     * @description A service type under which a service belongs to
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {string} ref - referenced collection
     * @property {boolean} required - mark required
     * @property {boolean} exists - ensure ref exists before save
     * @property {object} autopopulate - jurisdiction population options
     * @property {boolean} index - ensure database index
     * @since 1.2.0
     * @version 0.1.0
     * @instance
     */
    type: {
      type: ObjectId,
      ref: Predefine.MODEL_NAME,
      // required: true,
      exists: { refresh: true, select: Predefine.OPTION_SELECT },
      autopopulate: Predefine.OPTION_AUTOPOPULATE,
      index: true,
    },

    /**
     * @name priority
     * @description A default priority of the service.
     *
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
      // required: true,
      exists: { refresh: true, select: Priority.OPTION_SELECT },
      autopopulate: Priority.OPTION_AUTOPOPULATE,
      index: true,
    },

    /**
     * @name code
     * @description A unique identifier of the service.
     * Used in deriving code of the service request(issue) and
     * internal usage.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {boolean} uppercase - force uppercasing
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
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
        type: 'account',
      },
    },

    /**
     * @name name
     * @description A unique human readable name of the service
     * (request type) e.g Water Leakage.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} required - mark required
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    name: localize({
      type: String,
      trim: true,
      index: true,
      taggable: true,
      exportable: true,
      searchable: true,
      fake: {
        generator: 'hacker',
        type: 'ingverb',
      },
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
     * @property {boolean} exportable - allow field to be exporteds
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    description: localize({
      type: String,
      trim: true,
      index: true,
      exportable: true,
      searchable: true,
      fake: {
        generator: 'lorem',
        type: 'paragraph',
      },
    }),

    /**
     * @name color
     * @description A color (hexadecimal format) used to differentiate
     * service request type visually from other service.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} uppercase - force upper-casing
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    color: {
      type: String,
      trim: true,
      exportable: true,
      uppercase: true,
      default: () => randomColor(),
      fake: true,
    },

    /**
     * @name sla
     * @description A service level agreement of the service
     *
     * @type {object}
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    sla: SlaSchema,

    /**
     * @name flags
     * @description common flags for the service
     *
     * @type {object}
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    flags: FlagsSchema,

    /**
     * @name default
     * @description Tells whether a service is the default.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} index - ensure database index
     * @property {boolean} exportable - allow field to be exported
     * @property {boolean} default - default value set when none provided
     * @property {object|boolean} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * false
     *
     */
    default: {
      type: Boolean,
      index: true,
      exportable: true,
      default: false,
      fake: true,
    },
  },
  SCHEMA_OPTIONS,
  actions,
  exportable,
  open311Plugin
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

/**
 * @name index
 * @description ensure unique compound index on service name, code
 * and jurisdiction to force unique service definition
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
ServiceSchema.index(INDEX_UNIQUE, { unique: true });

/*
 *------------------------------------------------------------------------------
 * Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name  preValidate
 * @description run custom logics before validations
 * @param {Function} next a callback invoked after pre validate
 * @returns {object|Error} valid instance or error
 * @type {Function}
 */
ServiceSchema.pre('validate', function validate(next) {
  return this.preValidate(next);
});

/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @description service schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
ServiceSchema.methods.preValidate = function preValidate(done) {
  // ensure name for all locales
  this.name = localizedValuesFor(this.name);

  // ensure description for all locales
  this.description = localizedValuesFor(this.description);

  // set default color if not set
  if (_.isEmpty(this.color)) {
    this.color = randomColor();
  }

  // ensure jurisdiction from service group or priority
  const jurisdiction =
    _.get(this, 'group.jurisdiction') || _.get(this, 'priority.jurisdiction');
  if (!this.jurisdiction && jurisdiction) {
    this.jurisdiction = jurisdiction;
  }

  // ensure priority from service group
  const priority = _.get(this, 'priority') || _.get(this, 'group.priority');
  if (!this.priority && priority) {
    this.priority = priority;
  }

  // set service code
  if (_.isEmpty(this.code) && !_.isEmpty(this.name)) {
    // generate code from service group name
    const name = this.name[DEFAULT_LOCALE$1];
    this.code = _.take(name, 1)
      .join('')
      .toUpperCase();
  }

  // continue
  return done(null, this);
};

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete service logics
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} dependence free instance or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
ServiceSchema.methods.beforeDelete = function beforeDelete(done) {
  // restrict delete if

  // collect dependencies model name
  const dependencies = [MODEL_NAME_SERVICEREQUEST];

  // path to check
  const path = PATH_NAME_SERVICE;

  // do check dependencies
  return checkDependenciesFor(this, { path, dependencies }, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
ServiceSchema.statics.MODEL_NAME = MODEL_NAME_SERVICE;
ServiceSchema.statics.OPTION_SELECT = OPTION_SELECT;
ServiceSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

/**
 * @name findDefault
 * @function findDefault
 * @description find default service
 * @param {Function} done a callback to invoke on success or failure
 * @returns {Service} default service
 * @since 0.1.0
 * @version 1.0.0
 * @static
 */
ServiceSchema.statics.findDefault = done => {
  // refs
  const Service = model(MODEL_NAME_SERVICE);

  // obtain default service
  return Service.getOneOrDefault({}, done);
};

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed service to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @static
 */
ServiceSchema.statics.prepareSeedCriteria = seed => {
  const names = localizedKeysFor('name');

  const copyOfSeed = seed;
  copyOfSeed.name = localizedValuesFor(seed.name);

  const criteria = idOf(copyOfSeed)
    ? _.pick(copyOfSeed, '_id')
    : _.pick(copyOfSeed, 'jurisdiction', 'code', ...names);

  return criteria;
};

/**
 * @name getOneOrDefault
 * @function getOneOrDefault
 * @description Find existing service or default based on given criteria
 * @param {object} criteria valid query criteria
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} found service or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const criteria = { _id: '...'};
 * Service.getOneOrDefault(criteria, (error, found) => { ... });
 *
 */
ServiceSchema.statics.getOneOrDefault = (criteria, done) => {
  // normalize criteria
  const { _id, ...filters } = mergeObjects(criteria);
  const allowId = !_.isEmpty(_id);
  const allowFilters = !_.isEmpty(filters);

  const byDefault = mergeObjects({ default: true });
  const byId = mergeObjects({ _id });
  const byFilters = mergeObjects(filters);

  const or = compact([
    allowId ? byId : undefined,
    allowFilters ? byFilters : undefined,
     byDefault ,
  ]);
  const filter = { $or: or };

  // refs
  const Service = model(MODEL_NAME_SERVICE);

  // query
  return Service.findOne(filter)
    .orFail()
    .exec(done);
};

/* export service model */
var Service = model(MODEL_NAME_SERVICE, ServiceSchema);

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_OPEN_311 = '/open311/services.:ext?';
const PATH_SINGLE = '/services/:id';
const PATH_LIST = '/services';
const PATH_EXPORT = '/services/export';
const PATH_SCHEMA = '/services/schema/';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/services';

/**
 * @name ServiceHttpRouter
 * @namespace ServiceHttpRouter
 *
 * @description A representation of an acceptable
 * service (request types)(e.g Water Leakage) offered(or handled)
 * by a specific jurisdiction.
 *
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetServices
 * @memberof ServiceHttpRouter
 * @description Returns a list of services
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

/**
 * @name GetServiceSchema
 * @memberof ServiceHttpRouter
 * @description Returns service json schema definition
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Service.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportServices
 * @memberof ServiceHttpRouter
 * @description Export services as csv
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `services_exports_${Date.now()}.csv`;
      const readStream = Service.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name GetOpen311Services
 * @memberof ServiceHttpRouter
 * @description Returns a list of services in open311 format
 * @todo improve documentation
 */
router.get(PATH_OPEN_311, function getServices(request, response, next) {
  // obtain request options
  let options = _.merge({}, request.mquery, {
    filter: { 'flags.external': true },
  });

  // obtain provided jurisdiction criteria
  const jurisdiction = _.get(request, 'query.jurisdiction_id');

  // merge & clean options
  if (!_.isEmpty(jurisdiction)) {
    options = _.merge({}, options, { filter: { jurisdiction } });
  }
  options = _.omitBy(options, _.isUndefined);

  Service.get(options, function onGetServices(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);

      // map services to open311 compliant service list
      const services = _.map(results.data, function cb(service) {
        return service.toOpen311();
      });

      response.json(services);
    }
  });
});

/**
 * @name PostService
 * @memberof ServiceHttpRouter
 * @description Create new service
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Service.post(body, done),
  })
);

/**
 * @name GetService
 * @memberof ServiceHttpRouter
 * @description Get existing service
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Service.getById(options, done),
  })
);

/**
 * @name PatchService
 * @memberof ServiceHttpRouter
 * @description Patch existing service
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Service.patch(options, done),
  })
);

/**
 * @name PutService
 * @memberof ServiceHttpRouter
 * @description Put existing service
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Service.put(options, done),
  })
);

/**
 * @name DeleteService
 * @memberof ServiceHttpRouter
 * @description Delete existing service
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Service.del(options, done),
    soft: true,
  })
);

/**
 * @name GetJurisdictionServices
 * @memberof ServiceHttpRouter
 * @description Returns a list of services of specified jurisdiction
 */
router.get(
  PATH_JURISDICTION,
  getFor({
    get: (options, done) => Service.get(options, done),
  })
);

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
 * @license MIT
 * @example
 *
 * const { Service, start } = require('majifix-service-group');
 * start(error => { ... });
 *
 */

/**
 * @name info
 * @description package information
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */
const info = pkg(
  `${__dirname}/package.json`,
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
);

/**
 * @name apiVersion
 * @description http router api version
 * @type {string}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
const apiVersion = apiVersion$1();

export { Service, apiVersion, info, router as serviceRouter };
