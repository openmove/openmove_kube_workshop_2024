'use strict';

const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(async(server, {
  confs,
  models
}) => {
  const {log} = server
      , {identity} = confs
      , {images} = models;

  log.info({identity}, '[ROUTES] Istantiating upload request');

  server.route({
    'url': '/download/:processId',
    'method': 'GET',
    'schema': {
      'description': 'upload an image to mongo',
      'tags': ['IMAGES'],
      'params': {
        'type': 'object',
        'properties': {
          'processId': {
            'type': 'string'
          }
        }
      }
    },
    'handler': async(request, reply) => {
      log.info('[ROUTES] new upload request');
      const {params} = request;
      const {processId} = params;

      try {
        const {data, mimetype} = await images.getProcessedImage(processId);


        reply
          .code(200)
          .header('Content-Type', mimetype)
          // .header('Content-Length', data.buffer.length)
          .send(data.buffer);

      } catch (err) {
        throw new Error(`[ROUTES] Something went wrong during upload of image: ${err}`);
      }
    }
  });
}, {
  'name': __filename
});
