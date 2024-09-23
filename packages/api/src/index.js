'use strict';

const fastifyPlugin = require('fastify-plugin')
    , modelsImpl = require('./models')
    , routes = require('./routes');

module.exports = fastifyPlugin(async(server, {confs}) => {
  const {log, mongo, amqp} = server;
  const models = await modelsImpl({
    log,
    amqp,
    confs,
    mongo
  });

  await server.register(routes, {models, confs});

  return await server;
});
