from bson import ObjectId
from datetime import datetime

def retrieve_image(confs, id):
  db = confs.mongo['admin']
  collection = db['raw_uploads']

  confs.log.debug(f'Retrieving image document from mongo with id: {id}')
  document = collection.find_one({'_id': ObjectId(id)})

  return document


def store_processed_image(confs, binary_data, meta_data):
  db = confs.mongo['admin']
  collection = db['processed_images']


  confs.log.debug(f'Storing processed image in mongo')
  collection.insert_one({
    'data': binary_data,
    'filename': meta_data["filename"],
    'processId': meta_data["processId"],
    'mimetype': meta_data["mimetype"],
    'createDate': datetime.now()
  })
