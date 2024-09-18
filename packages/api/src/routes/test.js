
'use strict';

const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(async(server, {
  confs
}) => {
  const {log} = server
      , {identity} = confs;

  log.info({identity}, '[ROUTES] Istantiating test request');

  server.route({
    'url': '/test',
    'method': 'GET',
    'schema': {
      'description': 'TEST',
      'tags': ['TEST']
    },
    'handler': async(request, reply) => {
      log.info('[ROUTES] new test request');

      try {
        reply.code(200);
        return {};
      } catch (err) {
        throw new Error('[ROUTES] Something went wrong in test route');
      }
    }
  });
}, {
  'name': __filename
});
