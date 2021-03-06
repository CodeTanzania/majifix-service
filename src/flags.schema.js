import { createSubSchema } from '@lykmapipo/mongoose-common';

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

/* exports flags schema */
export default FlagsSchema;
