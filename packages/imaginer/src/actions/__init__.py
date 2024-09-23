from . import test
from . import process_image

def prepare_consumers(confs, models):
  consumers = []

  test_consumer = test.create(confs)
  image_process_consumer = process_image.create(confs, models)

  consumers.extend([
    test_consumer,
    image_process_consumer
  ])

  return consumers
