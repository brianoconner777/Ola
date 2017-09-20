import validateRequest from './validate-request';
import acceptRequest from './accept-request';
import fetchRequests from './fetch-requests';

exports.register = (server, options, next) => {
  validateRequest(server, options, next);
  acceptRequest(server, options, next);
  fetchRequests(server, options, next);
  next();
};

exports.register.attributes = {
  name: 'requests',
  version: '0.1'
};
