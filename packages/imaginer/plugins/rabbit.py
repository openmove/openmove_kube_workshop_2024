import pika

def create_connection(confs):
  rabbitConfs = confs.params['amqp']

  confs.log.debug('Recovering ampq credentials')
  credentials = pika.PlainCredentials(rabbitConfs['username'], rabbitConfs['password'])
  parameters = pika.ConnectionParameters(host=rabbitConfs['host'], credentials=credentials, virtual_host=rabbitConfs['vhs'])

  confs.log.debug('Istantiating connection')
  connection = pika.BlockingConnection(parameters)

  confs.rabbit = connection
