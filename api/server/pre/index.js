import extn from './ext';

exports.register = (server, options, next) => {
  extn(server, options, next);
  next();
};

exports.register.attributes = {
  name: 'pre',
  version: '0.1'
};
