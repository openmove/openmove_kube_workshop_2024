'use strict';

const fastifyPlugin = require('fastify-plugin')
  , connections = require('./connections');

module.exports = fastifyPlugin(async(server, {
  amqp,
  status
}) => {
  const {
    vhs,
    port,
    username,
    password,
    addresses
  } = amqp;
  const {stop} = status;

  if (!Array.isArray(vhs)) {
    throw new Error('[RABBIT] vhs must be an array');
  }

  server.log.debug({addresses, vhs, 'status': 'connecting'});
  const {
    'connections': amqpConnections,
    close
  } = await connections(server.log, stop, username, password, addresses, vhs, port);

  server.addHook('onClose', close);
  server.decorate('amqp', amqpConnections);

  server.log.debug({addresses, vhs, 'status': 'connected'}, '[RABBIT] rabbit amqp connected.');
}, {
  'name': 'amqp'
});
