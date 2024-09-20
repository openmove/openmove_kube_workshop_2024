import os

LOG_LEVEL = os.getenv('LOG_LEVEL', 'debug')
DOMAIN = os.getenv('DOMAIN', 'http://localhost:3001')
HOST = os.getenv('HOST', 'localhost')
PORT = os.getenv('PORT', '3001')
HTTP_ONLY = os.getenv('HTTP_ONLY', True)
SAME_SITE = os.getenv('SAME_SITE', True)
PROBE_PORT = os.getenv('PROBE_PORT', '3334')

# MONGO

MONGO_PREFIX = os.getenv('MONGO_PREFIX', 'mongodb')
MONGO_USERNAME = os.getenv('MONGO_USERNAME', 'WhosAsking')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD', 'NoneOfYourBusiness')
MONGO_HOST = os.getenv('MONGO_HOST', '127.0.0.1')
MONGO_DATABASE = os.getenv('MONGO_DATABASE', 'admin')

# RABBIT

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', '127.0.0.1')
RABBITMQ_USERNAME = os.getenv('RABBITMQ_USERNAME', 'CantCatchMe')
RABBITMQ_PASSWORD = os.getenv('RABBITMQ_PASSWORD', 'TooSlow123')
RABBITMQ_VIRTUALHOSTS = os.getenv('RABBITMQ_VIRTUALHOSTS', '/')

class Options:
  def __init__(self, log):
    log.info('Instantiating options class')

    self.log = log
    self.params = {
      'logLevel': LOG_LEVEL,
      'probePort': PROBE_PORT,
      'identity': {
        'port': PORT,
        'host': HOST,
        'domain': DOMAIN,
        'httpOnly': HTTP_ONLY,
        'sameSite': SAME_SITE
      },
      'mongo': {
        'prefix': MONGO_PREFIX,
        'username': MONGO_USERNAME,
        'password': MONGO_PASSWORD,
        'host': MONGO_HOST,
        'database': MONGO_DATABASE
      },
      'amqp': {
        'host': RABBITMQ_HOST,
        'username': RABBITMQ_USERNAME,
        'password': RABBITMQ_PASSWORD,
        'vhs': RABBITMQ_VIRTUALHOSTS
      }
    }

