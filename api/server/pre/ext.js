import wrapGen from '../util/wrapgen';

const handler = function*(request, reply) {
  return reply.continue();
};

const handleCORS = function*(request, reply) {
  try {
    if (request.headers['access-control-request-headers']) {
      request.response.header('Access-Control-Allow-Headers', request.headers['access-control-request-headers']);
    }

    if (request.headers['access-control-request-method']) {
      request.response.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    }

    if (request.headers['access-control-request-headers']) {
      request.response.header('Access-Control-Allow-Origin', request.headers['origin']);
    }

    return reply.continue();
  } catch (err) {
    console.log(err);
    return reply.continue();
  }
};

export default (server, options) => {
  server.ext('onRequest', wrapGen(handler));
  server.ext('onPreResponse', wrapGen(handleCORS));
};
