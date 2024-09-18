'use strict';

const fastify = require('fastify')
    , ajvKeywords = require('ajv-keywords')
    , querystring = require('query-string');

const logModule = require('./logger')
    , confs = require('./_conf')
    , {'log': {loggingTarget, level, name}, pluginTimeout} = confs
    , {'log': logger} = logModule({
      loggingTarget,
      level,
      name
    })
    , server = fastify({
      logger,
      pluginTimeout,
      'querystringParser': str => querystring.parse(str, {
        'arrayFormat': 'bracket'
      }),
      'ajv': {
        'plugins': [
          [ajvKeywords, ['transform']]
        ]
      }
    });

(async() => {
  server.log.info('[WORKSHOP] Setting up server');


  server.log.info('[WORKSHOP] Setting up server plugins');
  await server.register(require('./plugins'), confs);

  server.log.info('[WORKSHOP] Require of server shared components');
  await server.register(require('./src'), {confs});

  for (const anEvent of ['SIGINT', 'SIGTERM']) {
    server.log.info(`[WORKSHOP] Registering ${anEvent} termination event listener`);

    process.on(anEvent, async() => {
      await server.close();
    });
  }

  try {
    // eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
    const cors = require('@fastify/cors');

    await server.register(cors, {
      'origin': true,
      'methods': ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'],
      'allowHeaders': [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Keep-Alive',
        'User-Agent',
        'Content-Type',
        'Authorization',
        'Tenant',
        'Channel',
        'Platform',
        'Set-Cookie'
      ]
    });
  } catch (err) {

    server.log.info('[WORKSHOP] CORS is not present');
  }

  server.listen({
    'port': 3001,
    'host': '0.0.0.0'
  }, (err, address) => {
    if (err) {

      throw err;
    }
    server.log.info(`[WORKSHOP] LOADED PLUGINS\n${server.printPlugins()}`);
    server.log.info(`[WORKSHOP] LOADED ROUTES\n${server.printRoutes()}`);
    server.log.info(`[WORKSHOP] server listening on ${address}`);
  });
})();
