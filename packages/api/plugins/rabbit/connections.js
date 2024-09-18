'use strict';

const querystring = require('query-string')
  , amqp = require('amqplib')
  , camelcase = require('camelcase')
  , connectionOpts = querystring.stringify({
      'heartbeat': 60
    })
  , events = (log, host, vhost, stop) => ({
      'close': msg => {
        log.debug({msg}, `Amqp channel in ${host}/${vhost} close`);
      },
      'error': err => {

        log.error(err, `Amqp channel in ${host}/${vhost} thrown an error`);
        return stop();
      }
    })
  , fromConnection = (log, host, vhost, connection, stop) => {
      const {close, error} = events(log, host, vhost, stop);

      return {
        'createChannel': async() => {
          log.trace('Creating channel');
          const channel = await connection.createChannel()
            , delegated = delegate => async(...args) => {
                const isPublished = delegate.call(channel, ...args);

                if (!isPublished) {

                  return await new Promise(resolve => {
                    return channel.once('drain', err => {
                      if (err) {

                        log.error(err, 'Error catched while waiting for channel to drain');
                        return resolve(false);
                      }

                      return resolve(true);
                    });
                  });
                }

                return true;
              };

          channel.on('close', close);
          channel.on('error', error);

          log.trace('Setting channel prefetch value to 1');
          await channel.prefetch(1, true);

          return {
            'get': (...args) => channel.get(...args),
            'nack': (...args) => channel.nack(...args),
            'ack': (...args) => channel.ack(...args),
            'consume': (...args) => channel.consume(...args),
            'close': (...args) => channel.close(...args),
            'assertExchange': (...args) => channel.assertExchange(...args),
            'assertQueue': (...args) => channel.assertQueue(...args),
            'bindQueue': (...args) => channel.bindQueue(...args),
            'deleteQueue': (...args) => channel.deleteQueue(...args),
            'cancel': (...args) => channel.cancel(...args),
            'publish': delegated(channel.publish),
            'sendToQueue': delegated(channel.sendToQueue),
            'checkQueue': (...args) => {
              return new Promise(resolve => {
                return connection.createChannel()
                  .then(newChannel => {
                    newChannel.once('error', () => resolve(false));
                    return newChannel.checkQueue(...args)
                      .finally(() => newChannel.close());
                  })
                  .then(() => resolve(true), () => resolve(false));
              });
            }
          };
        }
      };
    }
  , connectionFactory = (log, stop) => async(user, pass, host, vhost, port = 5672) => {
      const client = await amqp.connect(`amqp://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${encodeURIComponent(vhost)}?${connectionOpts}`);

      client.on('close', msg => {
        log.debug({msg}, `Amqp connection to ${host}/${vhost} closed`);
        return stop();
      });

      client.on('error', err => {
        log.error(err, `Amqp connection to ${host}/${vhost} in error`);
        return stop();
      });

      return client;
    };

module.exports = async function amqpConnections(log, stop, rabbitMqUsername, rabbitMqPassword,
  rabbitMqAddresses, rabbitMqVHosts = ['/'], rabbitMqPort) {

  if (!Array.isArray(rabbitMqVHosts)) {
    throw new Error('[RABBIT] rabbitMqVHosts must be an array');
  }

  const connect = connectionFactory(log, stop)
    , closeArr = []
    , connections = {};

  for (const aVhost of rabbitMqVHosts) {
    log.debug(`[${rabbitMqAddresses}/${aVhost}] Connecting`);

    try {
      const connection = await connect(rabbitMqUsername, rabbitMqPassword, rabbitMqAddresses, aVhost, rabbitMqPort)
        , closingPolicy = async() => {
          log.trace(`[${rabbitMqAddresses}/${aVhost}] Closing connection`);
          return await connection.close();
        };

      closeArr.push(closingPolicy);

      log.trace(`[${rabbitMqAddresses}/${aVhost}] Connection established`);
      connections[camelcase(aVhost)] = fromConnection(log, rabbitMqAddresses, aVhost, connection, stop);
    } catch (err) {

      log.warn(`[${rabbitMqAddresses}/${aVhost}] Error catched: ${err.message}`);
      throw err;
    }
  }

  return {
    connections,
    'close': async() => {
      for (const aClosePolicy of closeArr) {

        await aClosePolicy();
      }
    }
  };
};
