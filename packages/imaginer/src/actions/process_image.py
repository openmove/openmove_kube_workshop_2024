import json
import random

QUEUE = 'imaginer.images'
AUTO_ACK = False


def callback_factory(confs, models):
  def callback(ch, method, properties, body):
    confs.log.info('new message received')

    json_body = body.decode()
    data = json.loads(json_body)
    storage = models['storage']
    images = models['images']

    confs.log.debug(f'new image to parse called: {data['filename']}')
    document = storage.retrieve_image(confs, data['imageId'])
    image = images.decode_binary(document['data'])

    processed_image = random.choice([
      images.blur,
      images.rotate,
      images.invert,
      images.pixelate
    ])(image)

    processed_data = images.encode_binary(processed_image)
    storage.store_processed_image(confs, processed_data, data)

    ch.basic_ack(delivery_tag=method.delivery_tag)
    confs.log.debug("Process of image completed")


  return callback


def create(confs, models):
  amqp_setup = {
    'queue': QUEUE,
    'durable':  True,
    'auto_ack': AUTO_ACK,
    'callback': callback_factory(confs, models)
  }
  image_process_consumer = confs.Consumer(confs, amqp_setup)
  confs.log.debug('Test consumer created')

  return image_process_consumer
