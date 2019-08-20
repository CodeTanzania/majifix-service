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

/* @todo add icon */
/* @todo add timestamps */

/* dependencies */
import _ from 'lodash';
import async from 'async';
import { randomColor } from '@lykmapipo/common';
import { getString, getStrings } from '@lykmapipo/env';
import { Schema, ObjectId, model } from '@lykmapipo/mongoose-common';

import actions from 'mongoose-rest-actions';
import localize from 'mongoose-locale-schema';

import {
  schema,
  models,
  PREDEFINE_NAMESPACE_SERVICETYPE,
  PREDEFINE_BUCKET_SERVICETYPE,
} from '@codetanzania/majifix-common';
import { Predefine } from '@lykmapipo/predefine';
import { Jurisdiction } from '@codetanzania/majifix-jurisdiction';
import { ServiceGroup } from '@codetanzania/majifix-service-group';
import { Priority } from '@codetanzania/majifix-priority';
import Sla from './sla.schema';
import Flags from './flags.schema';
import open311 from './open311.plugin';

/* constants */
const DEFAULT_LOCALE = getString('DEFAULT_LOCALE', 'en');
const LOCALES = getStrings('LOCALES', ['en']);
const JURISDICTION_PATH = 'jurisdiction';
const SERVICEGROUP_PATH = 'group';
const SERVICETYPE_PATH = 'type';
const PRIORITY_PATH = 'priority';
const { POPULATION_MAX_DEPTH } = schema;
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
} = models;

const locales = _.map(LOCALES, function getLocale(locale) {
  const option = { name: locale };
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
      ref: SERVICEGROUP_MODEL_NAME,
      required: true,
      exists: true,
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
      exists: true,
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
      ref: PRIORITY_MODEL_NAME,
      exists: true,
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
     * @property {Array}  locales - list of supported locales
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
     * @property {Array}  locales - list of supported locales
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
    sla: Sla,

    /**
     * @name flags
     * @description common flags for the service
     *
     * @type {object}
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    flags: Flags,
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
 * @returns {Function} next a callback invoked after pre validate
 * @type {Function}
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
    const name = this.name[DEFAULT_LOCALE];
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
 * @param  {Function} done callback to invoke on success or error
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
 * @param  {Function} done callback to invoke on success or error
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
          Jurisdiction.getById(
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

      // 2...preload service group
      group: function preloadServiceGroup(next) {
        // ensure service group is pre loaded before post(save)
        const groupId = this.group ? this.group._id : this.group; // eslint-disable-line no-underscore-dangle

        // prefetch existing group
        if (groupId) {
          ServiceGroup.getById(
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

      // 2...preload service type
      type: function preloadServiceType(next) {
        // ensure service type is pre loaded before post(save)
        const typeId = this.type ? this.type._id : this.type; // eslint-disable-line no-underscore-dangle
        const criteria = {
          _id: typeId,
          namespace: PREDEFINE_NAMESPACE_SERVICETYPE,
          bucket: PREDEFINE_BUCKET_SERVICETYPE,
        };

        // prefetch existing type
        if (typeId) {
          Predefine.getOneOrDefault(
            criteria,
            function cb(error, type) {
              // assign existing type
              if (type) {
                this.type = type;
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

      // 3...preload priority
      priority: function preloadPriority(next) {
        // ensure priority is pre loaded before post(save)
        const priorityId = this.priority ? this.priority._id : this.priority; // eslint-disable-line no-underscore-dangle

        // prefetch existing priority
        if (priorityId) {
          Priority.getById(
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
 * @param  {Function} done callback to invoke on success or error
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
    Jurisdiction.OPTION_AUTOPOPULATE
  );
  this.populate(jurisdiction);

  // ensure service group is populated after post(save)
  const group = _.merge(
    {},
    { path: SERVICEGROUP_PATH },
    ServiceGroup.OPTION_AUTOPOPULATE
  );
  this.populate(group);

  // ensure service type is populated after post(save)
  const type = _.merge(
    {},
    { path: SERVICETYPE_PATH },
    Predefine.OPTION_AUTOPOPULATE
  );
  this.populate(type);

  // ensure priority is populated after post(save)
  const priority = _.merge(
    {},
    { path: PRIORITY_PATH },
    Priority.OPTION_AUTOPOPULATE
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
ServiceSchema.statics.DEFAULT_LOCALE = DEFAULT_LOCALE;
ServiceSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */

/* use mongoose rest actions */
ServiceSchema.plugin(open311);
ServiceSchema.plugin(actions);

/* export service model */
export default model(SERVICE_MODEL_NAME, ServiceSchema);
