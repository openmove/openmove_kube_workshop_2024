'use strict';

const {'v4': uuid} = require('uuid');

const PLATFORM_EXCHANGE = 'platform.exchange'
    , PROCESS_IMAGE_QUEUE = 'imaginer.images'
    , PROCESS_IMAGE_ROUTING_KEY = 'process.image.request';


module.exports = async({
  log,
  mongo,
  amqp
}) => {
  log.debug('[MODELS] Preparing to istantiate Image module');

  const {admin} = mongo
      , {'/': reactor} = amqp
      , channel = await reactor.createChannel()
      , imagesCollection = admin.db.collection('raw_uploads');

  await channel.assertExchange(PLATFORM_EXCHANGE, 'direct', {
    'durable': true,
    'autoDelete': false
  });
  await channel.assertQueue(PROCESS_IMAGE_QUEUE, {
    'durable': true
  });
  await channel.bindQueue(PROCESS_IMAGE_QUEUE, PLATFORM_EXCHANGE, PROCESS_IMAGE_ROUTING_KEY);


  const storeImage = async data => {
    const chunks = [];
    const {
      filename,
      mimetype,
      size
    } = data;

    for await (const chunk of data.file) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const processId = uuid();
    const fileDoc = {
      filename,
      mimetype,
      processId,
      'data': buffer,
      'createDate': new Date()
    };

    log.debug({filename, mimetype, size}, '[IMAGES] Storing image');
    const {insertedId} = await imagesCollection.insertOne(fileDoc);

    log.debug({insertedId, filename, mimetype}, '[IMAGES] Image stored successfully');

    return {
      size,
      filename,
      processId,
      'imageId': insertedId
    };
  };

  const publishProcessRequest = async imageInfo => {
    const {imageId, filename, processId} = imageInfo;
    const payload = {
      'imageId': String(imageId),
      filename,
      processId
    };
    const buffer = Buffer.from(JSON.stringify(payload));

    return await channel.publish(PLATFORM_EXCHANGE, PROCESS_IMAGE_ROUTING_KEY, buffer);
  };

  return {
    storeImage,
    publishProcessRequest
  };
};
