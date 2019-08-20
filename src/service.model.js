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
import _ from 'lodash';
import { idOf, randomColor, compact, mergeObjects } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { createSchema, model, ObjectId } from '@lykmapipo/mongoose-common';
import {
  localize,
  localizedIndexesFor,
  localizedKeysFor,
  localizedValuesFor,
} from 'mongoose-locale-schema';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import {
  POPULATION_MAX_DEPTH,
  MODEL_NAME_SERVICE,
  MODEL_NAME_SERVICEREQUEST,
  COLLECTION_NAME_SERVICE,
  PATH_NAME_SERVICE,
  checkDependenciesFor,
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
 * @name ServiceSchema
 * @since 0.1.0
 * @version 0.1.0
 * @private
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
  open311
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
 * @returns {Function} next a callback invoked after pre validate
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

  // continue
  return done();
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

  const allowDefault = true;
  const allowId = !_.isEmpty(_id);
  const allowFilters = !_.isEmpty(filters);

  const byDefault = mergeObjects({ default: true });
  const byId = mergeObjects({ _id });
  const byFilters = mergeObjects(filters);

  const or = compact([
    allowId ? byId : undefined,
    allowFilters ? byFilters : undefined,
    allowDefault ? byDefault : undefined,
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
export default model(MODEL_NAME_SERVICE, ServiceSchema);
