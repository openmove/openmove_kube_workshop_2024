from . import test

def prepare_consumers(confs, Consumer):
  consumers = []

  test_consumer = test.create(confs, Consumer)
  consumers.append(test_consumer)

  return consumers
