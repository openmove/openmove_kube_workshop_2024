
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
    'url': '/upload',
    'method': 'POST',
    'schema': {
      'description': 'upload an image to mongo',
      'tags': ['IMAGES']
    },
    'handler': async(request, reply) => {
      log.info('[ROUTES] new upload request');

      try {
        const data = await request.file()
            , storeResult = await images.storeImage(data);

        await images.publishProcessRequest(storeResult);

        reply.code(200);
        return storeResult;
      } catch (err) {
        throw new Error(`[ROUTES] Something went wrong during upload of image: ${err}`);
      }
    }
  });
}, {
  'name': __filename
});
