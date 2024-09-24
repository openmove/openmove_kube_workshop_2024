'use strict';

const fastifyPlugin = require('fastify-plugin');
const test = require('./test');
const upload = require('./upload');
const download = require('./download');

module.exports = fastifyPlugin(async(server, {
  confs,
  models
}) => {
  const {log} = server;

  log.info('[ROUTES] Preparing to register routes');
  await server.register(test, {confs, models});
  await server.register(upload, {confs, models});
  await server.register(download, {confs, models});
});
