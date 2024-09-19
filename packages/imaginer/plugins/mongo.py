from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def create_connection(confs):
  mongoConfs = confs.params['mongo']

  try:
    url = f"{mongoConfs['prefix']}://{mongoConfs['username']}:{mongoConfs['password']}@{mongoConfs['host']}/{mongoConfs['database']}"

    confs.log.info('Connecting to mongo with url %s', url)
    client = MongoClient('mongodb://gtfs:gtfs@localhost:27017/database?authSource=admin&directConnection=true', serverSelectionTimeoutMS=15000)
    client.admin.command('ismaster')
    confs.mongo = client

  except ConnectionFailure as err:
    confs.log.error('Something went wrong while trying to instantiate mongoDb connection: %s', err)
