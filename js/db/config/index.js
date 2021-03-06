import log from 'loglevel';

let config;
switch (process.env.NODE_ENV) {
  // case 'production':
  //   log.info('loading config from config-production.json');
  //   config = require('./config-production.json');
  //   break;

  // case 'staging':
  //   log.info('loading config from config-staging.json');
  //   config = require('./config-staging.json');
  //   break;

  // Currently, other settings are not supported. I'll figure it out when I need to.

  default:
    log.info('loading config from config-development.json');
    config = require('./config-development.json');
    break;
}

export default config;
