import Confidence from 'confidence';

const criteria = {
  env: process.env.NODE_ENV
};

const config = {
  $meta: 'This file configures the system',
  projectName: 'Ola',
  port: {
    api: {
      $filter: 'env',
      test: 9000,
      production: process.env.APIPORT,
      $default: 2000
    }
  },
  host: {
    api: {
      $filter: 'env',
      test: 9000,
      production: process.env.HOST,
      $default: 'localhost'
    }
  },
  api: {
    resultCount: 40
  },
  mongoose: {
    $filter: 'env',
    production: {
      mongodb: {
        url: 'mongodb://localhost:27017/ola'
      },
      autoIndex: true
    },
    $default: {
      mongodb: {
        url: 'mongodb://localhost:27017/ola'
      },
      autoIndex: true
    }
  },
  goodLogger: {
    $filter: 'env',
    $default: {
      ops: {
        interval: 1000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout'],
        file: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-squeeze',
          name: 'SafeJson',
          args: [{
          }, {
            separator: '\n'
          }]
        }, {
          module: 'good-file',
          args: ['./logs/server_log']
        }],
        http: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-http',
          args: ['http://localhost:8888', {
            wreck: {
              headers: {
                'x-api-key': 12345
              }
            }
          }]
        }]
      }
    },
    default: {
      ops: {
        interval: 1000
      },
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout'],
        file: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-squeeze',
          name: 'SafeJson',
          args: [{
          }, {
            separator: '\n'
          }]
        }, {
          module: 'good-file',
          args: ['./logs/server_log']
        }],
        http: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*',
            request: '*',
            error: '*'
          }]
        }, {
          module: 'good-http',
          args: ['http://localhost:8888', {
            wreck: {
              headers: {
                'x-api-key': 12345
              }
            }
          }]
        }]
      }
    }
  }
};


const store = new Confidence.Store(config);

exports.get = (key) => {
  return store.get(key, criteria);
};

exports.meta = (key) => {
  return store.meta(key, criteria);
};
