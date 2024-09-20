'use strict';

const path = require('path');
const protobuf = require('protobufjs');

module.exports = async() => {

  const loadedProtos = {}
      , imageProtos = await protobuf.load(path.resolve(__dirname, 'images/process-request.proto'))
      , ProcessImage = imageProtos.lookupType('ProcessImage');

  loadedProtos.ProcessImage = ProcessImage;

  return loadedProtos;
};
