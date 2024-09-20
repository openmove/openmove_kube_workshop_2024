'use strict';

const fastifyPlugin = require('fastify-plugin')
    , modelsImpl = require('./models')
    , protosModule = require('./protos')
    , routes = require('./routes');

module.exports = fastifyPlugin(async(server, {confs}) => {
  const {log, mongo, amqp} = server;
  const protos = await protosModule();
  const models = await modelsImpl({
    log,
    confs,
    mongo,
    amqp,
    protos
  });

  await server.register(routes, {models, confs});

  return await server;
});
