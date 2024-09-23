'use strict';

const {name, description, version} = require('./package.json')
  , {
      LOGGING_TARGET,
      LOG_LEVEL = 'debug',
      DOMAIN = 'http://localhost:3001',

      HTTP_ONLY = 'true',
      SAME_SITE = 'true',

      //RABBITMQ_ADDRESSES = '127.0.0.1',
      RABBITMQ_ADDRESSES = 'rabbitmq.rabbitmq.svc.cluster.local',
      RABBITMQ_USERNAME = 'CantCatchMe',
      RABBITMQ_PASSWORD = 'TooSlow123',
      RABBITMQ_VIRTUALHOSTS = '/',

      MONGO_USERNAME = 'WhosAsking',
      MONGO_PASSWORD = 'NoneOfYourBusiness',
      //MONGO_HOSTS = '127.0.0.1',

      MONGO_HOSTS = 'mongodb.mongodb.svc.cluster.local',
      MONGO_DATABASES = 'admin',
      MONGO_ADDITIONAL_OPTIONS = '{}',
      MONGO_PREFS = JSON.stringify({
        'authSource': 'admin',
        'directConnection': 'true'
      })

    } = process.env
  , prefs = (() => {
      if (MONGO_PREFS) {

        return JSON.parse(MONGO_PREFS);
      }
    })()
  , additionalOptions = JSON.parse(MONGO_ADDITIONAL_OPTIONS)
  , databases = MONGO_DATABASES.split(/,\s?/)
  , rabbitMqVHosts = RABBITMQ_VIRTUALHOSTS.split(/,\s?/)
  , [protocol, fqdn, port] = DOMAIN.split(/:\/\/|:(\d+)/).filter(elm => elm);

const status = function status() {
  let isUp = true;

  return {
    'isUp': () => isUp,
    'stop': () => {
      // eslint-disable-next-line no-console
      console.trace('Calling stop!');
      isUp = false;
    }
  };
};

module.exports = {
  'identity': {
    'channel': 'workshop',
    'isSecure': protocol === 'https',
    'httpOnly': HTTP_ONLY === 'true',
    'sameSite': SAME_SITE === 'true',
    fqdn,
    port,
    'domain': DOMAIN,
    'path': '/'
  },
  'log': {
    'loggingTarget': LOGGING_TARGET,
    'level': LOG_LEVEL,
    'name': 'OM-WORKSHOP'
  },
  'status': status(),
  'swaggerUi': {
    'routePrefix': '/',
    'exposeRoute': true
  },
  'swagger': {
    'openapi': {
      'openapi': '3.0.0',
      'info': {
        'title': name,
        description,
        version
      },
      'host': fqdn,
      'schemes': [
        'http',
        'https'
      ],
      'consumes': ['application/json'],
      'produces': ['application/json'],
      'servers': [
        {
          'url': DOMAIN,
          description
        }
      ],
      'tags': [],
      'components': {
        'securitySchemes': {
          'bearerAuth': {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT'
          }
        }
      }
    }
  },
  'amqp': {
    'username': RABBITMQ_USERNAME,
    'password': RABBITMQ_PASSWORD,
    'addresses': RABBITMQ_ADDRESSES,
    'vhs': rabbitMqVHosts,
    'port': 5672
  },
  'mongodb': {
    'username': MONGO_USERNAME,
    'password': MONGO_PASSWORD,
    'hosts': MONGO_HOSTS,
    prefs,
    databases,
    additionalOptions
  }
};
