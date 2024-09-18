'use strict';

const fastifyPlugin = require('fastify-plugin')
    , modelsImpl = require('./models')
    , routes = require('./routes');

module.exports = fastifyPlugin(async(server, {confs}) => {
  const {log} = server;
  const models = modelsImpl({log, confs});

  await server.register(routes, {models, confs});

  return await server;
});
