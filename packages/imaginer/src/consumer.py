class Consumer:
  def __init__(self, confs, amqp_setup):
    self.log = confs.log
    self.amqp_connection = confs.rabbit
    self.setup = amqp_setup
    self.channel = self.amqp_connection.channel()

    self.channel.queue_declare(queue=self.setup['queue'], durable=self.setup['durable'])
    self.channel.basic_consume(queue=self.setup['queue'], on_message_callback=self.setup['callback'], auto_ack=self.setup['auto_ack'])

  def start_consuming(self):
    try:
      self.channel.start_consuming()
    except KeyboardInterrupt:
      self.log.warning('Consumer connection interrupted. Closing.')
      self.amqp_connection.close()


def setup_consumer(confs):
  confs.Consumer = Consumer
