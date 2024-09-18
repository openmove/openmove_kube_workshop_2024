'use strict';

const fastifyPlugin = require('fastify-plugin');
const test = require('./test');

module.exports = fastifyPlugin(async(server, {
  confs,
  models
}) => {
  const {log} = server;

  log.info('[ROUTES] Preparing to register routes');
  await server.register(test, {confs, models});
});
