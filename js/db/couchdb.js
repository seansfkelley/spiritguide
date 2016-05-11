import _ from 'lodash';
import log from 'loglevel';
import PouchDB from 'react-native-pouchdb';
import Promise from 'bluebird';

import config from './config';

const FN_NAMES_TO_PROXY = [
  'get',
  'post',
  'put',
  'allDocs',
  'bulkDocs'
];

class PouchDbProxy {
  constructor(delegate) {
    FN_NAMES_TO_PROXY.forEach(fnName => {
      this[fnName] = this.wrap(this[fnName].bind(delegate));
    });
  }
}

class BluebirdPromisePouchDb extends PouchDbProxy {
  wrap(fn) {
    return (...args) => Promise.resolve(fn(...args));
  }
}

class RetryingPouchDb extends PouchDbProxy {
  wrap(fn) {
    return (...args) => {
      function retryHelper(retries) {
        return fn(...args)
        .catch((e) => {
          if (retries > 0) {
            return retryHelper(retries - 1);
          } else {
            throw e;
          }
        });
      }
      return retryHelper(1);
    };
  }
}

export const get = _.once(() => {
  const auth = _.pick(config.couchDb, 'username', 'password');
  const authOptions = _.size(auth) == 2
    ? { auth }
    : {};

  const dbOptions = _.extend({ adapter: 'websql' }, authOptions);

  return _.mapValues({
    recipeDb: config.couchDb.url + config.couchDb.recipeDbName,
    configDb: config.couchDb.url + config.couchDb.configDbName,
    ingredientDb: config.couchDb.url + config.couchDb.ingredientDbName
  }, url => new RetryingPouchDb(new BluebirdPromisePouchDb(new PouchDB(url, dbOptions))));
});
