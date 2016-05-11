import log from 'loglevel';

let config;
switch (process.env.NODE_ENV) {
  case 'production':
    log.info('loading config from config-production.json');
    config = require(`${__dirname}/config-production.json`);
    break;

  case 'staging':
    log.info('loading config from config-staging.json');
    config = require(`${__dirname}/config-staging.json`);
    break;

  default:
    log.info('loading config from config-development.json');
    config = require(`${__dirname}/config-development.json`);
    break;
}

export default config;
