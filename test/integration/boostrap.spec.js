import { connect, clear, drop } from '@lykmapipo/mongoose-test-helpers';

process.env.PREDEFINE_NAMESPACES = 'Item,Zone,Unit,ServiceType,BlockReason';

/* setup database */
before(done => connect(done));

/* clear database */
before(done => clear(done));

/* drop database */
after(done => drop(done));
