'use strict';

const PLATFORM_EXCHANGE = 'platform.exchange'
    , PROCESS_IMAGE_QUEUE = 'imaginer.images'
    , PROCESS_IMAGE_ROUTING_KEY = 'process.image.request';


module.exports = async({
  log,
  mongo,
  amqp,
  protos
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
    const fileDoc = {
      filename,
      mimetype,
      size,
      'data': buffer,
      'uploadDate': new Date()
    };

    log.debug({filename, mimetype, size}, '[IMAGES] Storing image');
    const {insertedId} = await imagesCollection.insertOne(fileDoc);

    log.debug({insertedId, filename, mimetype}, '[IMAGES] Image stored successfully');

    return {
      size,
      filename,
      'imageId': insertedId
    };
  };

  const publishProcessRequest = async imageInfo => {
    const {imageId, filename} = imageInfo;
    const {ProcessImage} = protos;
    const payload = {
      'imageId': String(imageId),
      filename
    };
    const buffer = ProcessImage.encode(payload).finish();

    return await channel.publish(PLATFORM_EXCHANGE, PROCESS_IMAGE_ROUTING_KEY, buffer);
  };

  return {
    storeImage,
    publishProcessRequest
  };
};
