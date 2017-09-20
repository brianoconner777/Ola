import fetchRequests from './fetch-requests';

exports.register = (server, options, next) => {
  fetchRequests(server, options, next);
  next();
};

exports.register.attributes = {
  name: 'drivers',
  version: '0.1'
};
