QUEUE = 'sys.metrics'
AUTO_ACK = False

def callback_factory(confs):
  def callback(ch, method, properties, body):
    confs.log.info('new message received')
    confs.log.info(ch)

  return callback


def create(confs):
  amqp_setup = {
    'queue': QUEUE,
    'durable':  True,
    'auto_ack': AUTO_ACK,
    'callback': callback_factory(confs)
  }
  test_consumer = confs.Consumer(confs, amqp_setup)
  confs.log.debug('Test consumer created')

  return test_consumer
