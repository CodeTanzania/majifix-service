// dependencies
const app = require('@lykmapipo/express-common');
const { connect, jsonSchema } = require('@lykmapipo/mongoose-common');
const { router, info, apiVersion } = require('../lib/index');

app.mount(router);

connect(connectionError => {
  if (connectionError) {
    throw connectionError;
  }

  app.get('/', (request, response) => {
    response.status(200);
    response.json(info);
  });

  app.get(`/${apiVersion}/schemas`, (request, response) => {
    const schema = jsonSchema();
    response.status(200);
    response.json(schema);
  });

  /* fire the app */
  app.start((error, env) => {
    console.log(`visit http://0.0.0.0:${env.PORT}/${apiVersion}/services`);
  });
});
