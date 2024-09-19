from . import actions
from .consumer import Consumer

def start_imaginer(confs):
  consumers = actions.prepare_consumers(confs, Consumer)

  for consumer in consumers:
    consumer.start_consuming()
