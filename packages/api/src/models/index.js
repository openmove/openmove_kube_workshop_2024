'use strict';

const imageModule = require('./images');

module.exports = async deps => {
  const {log} = deps;

  log.info('[MODELS] Instantiating models');
  const images = await imageModule(deps);

  return {
    images
  };
};
