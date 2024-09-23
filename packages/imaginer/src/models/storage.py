from bson import ObjectId
from datetime import datetime

def retrieve_image(confs, id):
  db = confs.mongo['admin']
  collection = db['raw_uploads']

  confs.log.debug(f'Retrieving image document from mongo with id: {id}')
  document = collection.find_one({'_id': ObjectId(id)})

  return document


def store_processed_image(confs, data, filename):
  db = confs.mongo['admin']
  collection = db['processed_images']

  confs.log.debug(f'Storing processed image in mongo')
  collection.insert_one({
    'data': data,
    'filename': filename,
    'createDate': datetime.now()
  })
