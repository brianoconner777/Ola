import createRequest from './create-request';

exports.register = (server, options, next) => {
  createRequest(server, options, next);
  next();
};

exports.register.attributes = {
  name: 'customers',
  version: '0.1'
};
