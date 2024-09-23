from . import actions
from . import models
from . import consumer

def start_imaginer(confs):
  consumer.setup_consumer(confs)
  models_impl = models.get_models()
  consumers = actions.prepare_consumers(confs, models_impl)


  for c in consumers:
    c.start_consuming()
