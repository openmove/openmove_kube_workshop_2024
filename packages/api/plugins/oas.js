'use strict';

const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(async(server, {
  swagger,
  swaggerUi = {
    'routePrefix': '/',
    'exposeRoute': true
  }
}) => {

  server.log.trace('Registering OpenApi plugin');
  await server.register(require('@fastify/swagger'), swagger);
  await server.register(require('@fastify/swagger-ui'), swaggerUi);

  // Plugin loading starts when you call fastify.listen(), fastify.inject() or fastify.ready()
  // If you get After the boot you can't add decorators, hooks or plugins: After the boot you can't add decorators, hooks or plugins.
  server.ready(err => {
    if (err) {
      throw err;
    }

    server.swagger();
    server.log.trace('OpenApi plugin initialized');
  });
}, {
  'name': 'oas'
});
