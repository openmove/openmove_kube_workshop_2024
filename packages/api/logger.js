'use strict';

const pino = require('pino')
  , {getPinoOptions} = require('@relaycorp/pino-cloud');

module.exports = ({
  loggingTarget = 'local',
  level = 'debug',
  name
}) => {
  const logOpts = {
    level,
    'serializers': {
      'req': pino.stdSerializers.req,
      'res': pino.stdSerializers.res,
      'err': pino.stdSerializers.err
    }
  };
  const logOptsGCP = loggingTarget === 'gcp' ? getPinoOptions('gcp', {name}) : {};
  let parentLogger = pino({...logOptsGCP, ...logOpts});

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const stream = require('pino-pretty')({
      'colorize': true,
      'singleLine': true,
      'ignore': 'pid,hostname,time',
      'levelFirst': true
    });

    parentLogger = pino({...logOptsGCP, ...logOpts}, stream);
  } catch (err) {

    parentLogger.info(err, 'No colors!');
  }

  const log = parentLogger.child({name});

  return {
    log
  };
};
