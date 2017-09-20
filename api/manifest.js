import Confidence from 'confidence';
import Config from './config';

const criteria = {
  env: process.env.NODE_ENV
};

const manifest = {
  $meta: 'Meta info goes here',
  server: {
    debug: false,
    connections: {
      routes: {
        security: true,
        cors: {
          origin: ['*'],
          credentials: true,
          additionalHeaders: ['Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Credentials']
        }
      }
    }
  },
  connections: [{
    port: Config.get('/port/api'),
    labels: ['web']
  }],
  registrations: [{
    plugin: {
      register: 'good',
      options: Config.get('/goodLogger')
    }
  }, {
    plugin: 'vision'
  }, {
    plugin: 'inert'
  }, {
    plugin: 'lout'
  }, {
      plugin: './server/pre'
  }, {
      plugin: './server/api/customers'
  }, {
      plugin: './server/api/drivers'
  }, {
      plugin: './server/api/requests'
  }]
};


const store = new Confidence.Store(manifest);

exports.get = (key) => {
  return store.get(key, criteria);
};


exports.meta = (key) => {
  return store.meta(key, criteria);
};
