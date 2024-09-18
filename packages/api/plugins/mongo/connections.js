'use strict';

const qs = require('query-string')
  , mongodb = require('mongodb')
  , connectionFactory = (log, stop) => async function connection(
    mongoUsername, mongoPassword, hosts, aDatabase, prefs, additionalOptions = {}) {
      const {prefix = 'mongodb'} = additionalOptions
        , connectionString = `${prefix}://${mongoUsername}:${mongoPassword}@${hosts}/${aDatabase}?${qs.stringify(prefs)}`;

      log.debug(`Connecting to ${hosts}/${aDatabase}`);
      log.trace(`Connection string is ${connectionString}`);

      const client = await mongodb.MongoClient.connect(connectionString, {
          'useUnifiedTopology': true,
          'useNewUrlParser': true
        });

      client.on('close', msg => {
        log.debug({msg}, `Mongo connection to ${hosts}/${aDatabase} closed`);
      });

      client.on('error', err => {
        log.error(err, `Mongo connection to ${hosts}/${aDatabase} in error`);
        return stop();
      });


      log.debug(`Connected to ${hosts}/${aDatabase}`);

      return client;
    }
  , closingPolicyFactory = ({
      client,
      keepAliveDbStats = 30000,
      log
    }) => {
    const intervalRef = setTimeout(async() => {
      const stats = await client.db.command({
        'dbStats': 1
      });

      log.trace(stats);
      intervalRef.refresh();
    }, keepAliveDbStats).unref();

    return async function closeADatabase(force = false) {

      clearTimeout(intervalRef);
      return await client.close(force);
    };
  };

module.exports = async function modelMongo(log, stop, mongoUsername, mongoPassword, mongoHosts,
  mongoDatabases, mongoPrefs, additionalOptions) {
  const keepAliveDbStats = additionalOptions?.keepAliveDbStats ?? 10000;

  if (!Array.isArray(mongoDatabases)) {
    throw new Error('[MONGO] database must be an array');
  }

  const connect = connectionFactory(log, stop)
      , closingFunctions = []
      , connections = {};

  for (const aDatabase of mongoDatabases) {
    const thisClient = await connect(mongoUsername, mongoPassword, mongoHosts, aDatabase, mongoPrefs, additionalOptions);

    if (thisClient == null) {
      log.error(`[MONGO] Mongo client to ${mongoHosts}/${aDatabase} got issues`);
    } else {

      thisClient.originalDb = thisClient.db;
      thisClient.db = thisClient.db();
      connections[aDatabase] = thisClient;
      closingFunctions.push(closingPolicyFactory({
        'client': thisClient,
        keepAliveDbStats,
        log
      }));
    }
  }

  return {
    connections,
    'close': async function close() {
      log.debug(`[MONGO] Tearing down connections for ${mongoHosts}...`);
      for (const aCloseFunction of closingFunctions) {

        await aCloseFunction(true);
      }
      log.debug(`[MONGO] Connections for ${mongoHosts} are closed`);
    }
  };
};
