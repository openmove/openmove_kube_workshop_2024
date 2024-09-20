'use strict';

const fastifyPlugin = require('fastify-plugin')
  , connections = require('./connections')
  , pluginResultName = 'mongo';

module.exports = fastifyPlugin(async(server, {
  mongodb,
  status
}) => {
  const {
    username,
    password,
    hosts,
    prefs,
    databases,
    additionalOptions
  } = mongodb
    , {stop} = status;

  if (!Array.isArray(databases)) {
    throw new Error('[MONGO] Databases has to be an Array');
  }

  const {
    'connections': mongoDbConnections,
    close
  } = await connections(server.log, stop, username, password, hosts, databases, prefs, additionalOptions);

  server.addHook('onClose', close);
  if (Object.prototype.hasOwnProperty.call(server, pluginResultName)) {

    for (const [key, value] of Object.entries(mongoDbConnections)) {
      server[pluginResultName][key] = value;
    }
  } else {
    server.decorate(pluginResultName, mongoDbConnections);
  }

  server.log.debug({databases, 'status': 'connected'}, '[MONGO] Mongo db connected.');
}, {
  'name': 'mongo'
});
