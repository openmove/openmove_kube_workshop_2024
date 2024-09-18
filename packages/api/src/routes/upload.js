
'use strict';

const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(async(server, {
  confs,
  models
}) => {
  const {log} = server
      , {identity} = confs
      , {images} = models

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
      const chunks = [];

      try {
        const data = await request.file();

        debugger

        for await (const chunk of data.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Crea il documento che verrà inserito nel database
        const fileDoc = {
          filename: data.filename,
          mimetype: data.mimetype,
          size: data.file.bytesRead,
          data: buffer,
          uploadDate: new Date()
        };

        // const collection = db.collection('uploads');
        // const result = await collection.insertOne(fileDoc);



        reply.code(200);
        return 'ok';
      } catch (err) {
        throw new Error('[ROUTES] Something went wrong in test route');
      }
    }
  });
}, {
  'name': __filename
});
