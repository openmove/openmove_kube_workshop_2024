'use strict';

const config = {
    'port': process.env.PORT || 8080,
    'api': {
        'baseUrl': process.env.API_BASE_URL || 'http://localhost:3001'
    }
};

module.exports = config;
