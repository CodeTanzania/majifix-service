'use strict';

const common = require('@lykmapipo/common');
const _ = require('lodash');
const async = require('async');
const randomColor = require('randomcolor');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const localize = require('mongoose-locale-schema');
const majifixCommon = require('@codetanzania/majifix-common');
const env = require('@lykmapipo/env');
const majifixJurisdiction = require('@codetanzania/majifix-jurisdiction');
const majifixServiceGroup = require('@codetanzania/majifix-service-group');
const majifixPriority = require('@codetanzania/majifix-priority');
const expressCommon = require('@lykmapipo/express-common');

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

/* declarations */
const { SUB_DOC_SCHEMA_OPTIONS } = majifixCommon.schema;

/**
 * @name SlaSchema
 * @type {Schema}
 * @private
 */
const SlaSchema = new mongoose.Schema(
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

/* declarations */
const { SUB_DOC_SCHEMA_OPTIONS: SUB_DOC_SCHEMA_OPTIONS$1 } = majifixCommon.schema;

/**
 * @name FlagsSchema
 * @type {Schema}
 * @private
 */
const FlagsSchema = new mongoose.Schema(
  {
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
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    external: {
      type: Boolean,
      index: true,
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
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    account: {
      type: Boolean,
      index: true,
      default: false,
      fake: true,
    },
  },
  SUB_DOC_SCHEMA_OPTIONS$1
);

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

/* constants */
const DEFAULT_LOCALE = env.getString('DEFAULT_LOCALE', 'en');

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
function open311Plugin(schema) {
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

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

/* constants */
const DEFAULT_LOCALE$1 = env.getString('DEFAULT_LOCALE', 'en');
const LOCALES = env.getStrings('LOCALES', ['en']);
const JURISDICTION_PATH = 'jurisdiction';
const SERVICEGROUP_PATH = 'group';
const PRIORITY_PATH = 'priority';
const { POPULATION_MAX_DEPTH } = majifixCommon.schema;
const SCHEMA_OPTIONS = { timestamps: true, emitIndexErrors: true };
const OPTION_AUTOPOPULATE = {
  select: {
    jurisdiction: 1,
    group: 1,
    priority: 1,
    code: 1,
    name: 1,
    color: 1,
  },
  maxDepth: POPULATION_MAX_DEPTH,
};
const {
  SERVICEGROUP_MODEL_NAME,
  SERVICE_MODEL_NAME,
  SERVICEREQUEST_MODEL_NAME,
  JURISDICTION_MODEL_NAME,
  PRIORITY_MODEL_NAME,
  getModel,
} = majifixCommon.models;

const locales = _.map(LOCALES, function getLocale(locale) {
  const option = { name: locale };
  if (locale === DEFAULT_LOCALE$1) {
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
const ServiceSchema = new Schema(
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
      ref: JURISDICTION_MODEL_NAME,
      exists: true,
      autopopulate: majifixJurisdiction.Jurisdiction.OPTION_AUTOPOPULATE,
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
      ref: SERVICEGROUP_MODEL_NAME,
      required: true,
      exists: true,
      autopopulate: majifixServiceGroup.ServiceGroup.OPTION_AUTOPOPULATE,
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
      ref: PRIORITY_MODEL_NAME,
      exists: true,
      autopopulate: majifixPriority.Priority.OPTION_AUTOPOPULATE,
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
      locales,
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
      locales,
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
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    color: {
      type: String,
      trim: true,
      uppercase: true,
      default() {
        return randomColor().toUpperCase();
      },
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
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Indexes
 *------------------------------------------------------------------------------
 */

// ensure `unique` compound index on jurisdiction, code and name
// to fix unique indexes on code and name in case they are used in more than
// one jurisdiction with different administration
_.forEach(locales, function ensureIndex(locale) {
  const field = `name.${locale.name}`;
  ServiceSchema.index(
    { jurisdiction: 1, code: 1, [field]: 1 },
    { unique: true }
  );
});

/*
 *------------------------------------------------------------------------------
 * Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name  preValidate
 * @description run custom logics before validations
 * @return {function} next a callback invoked after pre validate
 * @type {function}
 */
ServiceSchema.pre('validate', function validate(next) {
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

  next();
});

/*
 *------------------------------------------------------------------------------
 * Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name beforeDelete
 * @function beforeDelete
 * @description pre delete service logics
 * @param  {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
ServiceSchema.methods.beforeDelete = function beforeDelete(done) {
  // restrict delete if

  async.parallel(
    {
      // 1...there are service request use the service
      serviceRequest: function checkServiceRequestDependency(next) {
        // get service request model
        const ServiceRequest = getModel(SERVICEREQUEST_MODEL_NAME);

        // check service request dependency
        if (ServiceRequest) {
          ServiceRequest.count(
            { service: this._id }, // eslint-disable-line no-underscore-dangle
            function cb(error, count) {
              let cbError = error;
              // warning can not delete
              if (count && count > 0) {
                const errorMessage = `Fail to Delete. ${count} service requests depend on it`;
                cbError = new Error(errorMessage);
              }

              // ensure error status
              if (cbError) {
                cbError.status = 400;
              }

              // return
              next(cbError, this);
            }.bind(this)
          );
        }

        // continue
        else {
          next();
        }
      }.bind(this),
    },
    function cb(error) {
      done(error, this);
    }
  );
};

/**
 * @name beforePost
 * @function beforePost
 * @description pre save service logics
 * @param  {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
ServiceSchema.methods.beforePost = function beforePost(done) {
  // pre loads
  async.parallel(
    {
      // 1...preload jurisdiction
      jurisdiction: function preloadJurisdiction(next) {
        // ensure jurisdiction is pre loaded before post(save)
        const jurisdictionId = this.jurisdiction
          ? this.jurisdiction._id // eslint-disable-line no-underscore-dangle
          : this.jurisdiction;

        // prefetch existing jurisdiction
        if (jurisdictionId) {
          majifixJurisdiction.Jurisdiction.getById(
            jurisdictionId,
            function cb(error, jurisdiction) {
              // assign existing jurisdiction
              if (jurisdiction) {
                this.jurisdiction = jurisdiction;
              }

              // return
              next(error, this);
            }.bind(this)
          );
        }

        // continue
        else {
          next();
        }
      }.bind(this),

      // 1...preload service group
      group: function preloadServiceGroup(next) {
        // ensure service group is pre loaded before post(save)
        const groupId = this.group ? this.group._id : this.group; // eslint-disable-line no-underscore-dangle

        // prefetch existing group
        if (groupId) {
          majifixServiceGroup.ServiceGroup.getById(
            groupId,
            function cb(error, group) {
              // assign existing group
              if (group) {
                this.group = group;
              }

              // return
              next(error, this);
            }.bind(this)
          );
        }

        // continue
        else {
          next();
        }
      }.bind(this),

      // 1...preload priority
      priority: function preloadPriority(next) {
        // ensure priority is pre loaded before post(save)
        const priorityId = this.priority ? this.priority._id : this.priority; // eslint-disable-line no-underscore-dangle

        // prefetch existing priority
        if (priorityId) {
          majifixPriority.Priority.getById(
            priorityId,
            function cb(error, priority) {
              // assign existing priority
              if (priority) {
                this.priority = priority;
              }

              // return
              next(error, this);
            }.bind(this)
          );
        }

        // continue
        else {
          next();
        }
      }.bind(this),
    },
    function cb(error) {
      done(error, this);
    }.bind(this)
  );
};

/**
 * @name afterPost
 * @function afterPost
 * @description post save service logics
 * @param  {function} done callback to invoke on success or error
 *
 * @since 0.1.0
 * @version 1.0.0
 * @instance
 */
ServiceSchema.methods.afterPost = function afterPost(done) {
  // ensure jurisdiction is populated after post(save)
  const jurisdiction = _.merge(
    {},
    { path: JURISDICTION_PATH },
    majifixJurisdiction.Jurisdiction.OPTION_AUTOPOPULATE
  );
  this.populate(jurisdiction);

  // ensure service group is populated after post(save)
  const group = _.merge(
    {},
    { path: SERVICEGROUP_PATH },
    majifixServiceGroup.ServiceGroup.OPTION_AUTOPOPULATE
  );
  this.populate(group);

  // ensure priority is populated after post(save)
  const priority = _.merge(
    {},
    { path: PRIORITY_PATH },
    majifixPriority.Priority.OPTION_AUTOPOPULATE
  );
  this.populate(priority, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* expose static constants */
ServiceSchema.statics.MODEL_NAME = SERVICE_MODEL_NAME;
ServiceSchema.statics.DEFAULT_LOCALE = DEFAULT_LOCALE$1;
ServiceSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* use mongoose rest actions */
ServiceSchema.plugin(open311Plugin);
ServiceSchema.plugin(actions);

/* export service model */
const Service = mongoose.model(SERVICE_MODEL_NAME, ServiceSchema);

/**
 * @apiDefine Service  Service
 *
 * @apiDescription A representation of an acceptable
 * service (request types)(e.g Water Leakage) offered(or handled)
 * by a specific jurisdiction.
 *
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */

/* local constants */
const API_VERSION = env.getString('API_VERSION', '1.0.0');
const PATH_OPEN_311 = '/open311/services.:ext?';
const PATH_LIST = '/services';
const PATH_SINGLE = '/services/:id';
const PATH_JURISDICTION = '/jurisdictions/:jurisdiction/services';

/* declarations */
const router = new expressCommon.Router({
  version: API_VERSION,
});

/**
 * @api {get} /services List Services
 * @apiVersion 1.0.0
 * @apiName GetServices
 * @apiGroup Service
 * @apiDescription Returns a list of services
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_LIST, function getServices(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  Service.get(options, function onGetServices(error, results) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(results);
    }
  });
});

/**
 * @api {get} /open311/services List Services
 * @apiVersion 1.0.0
 * @apiName GetOpen311Services
 * @apiGroup Service
 * @apiDescription Returns a list of services in open311 format
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
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
 * @api {post} /services Create New Service
 * @apiVersion 1.0.0
 * @apiName PostService
 * @apiGroup Service
 * @apiDescription Create new service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(PATH_LIST, function postService(request, response, next) {
  // obtain request body
  const body = _.merge({}, request.body);

  Service.post(body, function onPostService(error, created) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(201);
      response.json(created);
    }
  });
});

/**
 * @api {get} /services/:id Get Existing Service
 * @apiVersion 1.0.0
 * @apiName GetService
 * @apiGroup Service
 * @apiDescription Get existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_SINGLE, function getService(request, response, next) {
  // obtain request options
  const options = _.merge({}, request.mquery);

  // obtain service id
  options._id = request.params.id; // eslint-disable-line no-underscore-dangle

  Service.getById(options, function onGetService(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

/**
 * @api {patch} /services/:id Patch Existing Service
 * @apiVersion 1.0.0
 * @apiName PatchService
 * @apiGroup Service
 * @apiDescription Patch existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(PATH_SINGLE, function patchService(request, response, next) {
  // obtain service id
  const { id } = request.params;

  // obtain request body
  const patches = _.merge({}, request.body);

  Service.patch(id, patches, function onPatchService(error, patched) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(patched);
    }
  });
});

/**
 * @api {put} /services/:id Put Existing Service
 * @apiVersion 1.0.0
 * @apiName PutService
 * @apiGroup Service
 * @apiDescription Put existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(PATH_SINGLE, function putService(request, response, next) {
  // obtain service id
  const { id } = request.params;

  // obtain request body
  const updates = _.merge({}, request.body);

  Service.put(id, updates, function onPutService(error, updated) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(updated);
    }
  });
});

/**
 * @api {delete} /services/:id Delete Existing Service
 * @apiVersion 1.0.0
 * @apiName DeleteService
 * @apiGroup Service
 * @apiDescription Delete existing service
 * @apiUse RequestHeaders
 * @apiUse Service
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServiceSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(PATH_SINGLE, function deleteService(request, response, next) {
  // obtain service id
  const { id } = request.params;

  Service.del(id, function onDeleteService(error, deleted) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(deleted);
    }
  });
});

/**
 * @api {get} /jurisdictions/:jurisdiction/services List Jurisdiction Services
 * @apiVersion 1.0.0
 * @apiName GetJurisdictionServices
 * @apiGroup Service
 * @apiDescription Returns a list of services of specified jurisdiction
 * @apiUse RequestHeaders
 * @apiUse Services
 *
 * @apiUse RequestHeadersExample
 * @apiUse ServicesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(PATH_JURISDICTION, function getServices(request, response, next) {
  // obtain request options
  const { jurisdiction } = request.params;
  const filter = jurisdiction ? { filter: { jurisdiction } } : {};
  const options = _.merge({}, filter, request.mquery);

  Service.get(options, function onGetServices(error, found) {
    // forward error
    if (error) {
      next(error);
    }

    // handle response
    else {
      response.status(200);
      response.json(found);
    }
  });
});

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
 * const { app } = require('majifix-service-group');
 *
 * ...
 *
 * app.start()
 */

/* declarations */
const info = common.pkg(
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

// extract router api version
const apiVersion = router.version;

exports.Service = Service;
exports.apiVersion = apiVersion;
exports.info = info;
exports.router = router;
