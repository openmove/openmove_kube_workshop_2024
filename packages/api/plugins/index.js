'use strict';

const fastifyPlugin = require('fastify-plugin')
    , fastifyMultipart = require('fastify-multipart')
    , rabbit = require('./rabbit')
    , mongo = require('./mongo')
    , oas = require('./oas');

module.exports = fastifyPlugin(async(server, deps) => {
  await server.register(fastifyMultipart);
  await server.register(rabbit, deps);
  await server.register(mongo, {'mongodb': deps.mongodb, 'status': deps.status});
  await server.register(oas, {...deps});
}, {
  'name': 'plugins'
});
