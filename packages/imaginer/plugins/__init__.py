from . import mongo
from . import rabbit

def instantiate_plugins(confs):
  confs.log.info('Preparing connection to mongo')
  mongo.create_connection(confs)

  confs.log.info('Preparing connection to rabbitMQ')
  rabbit.create_connection(confs)
