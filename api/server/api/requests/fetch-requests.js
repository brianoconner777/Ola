import Request from '../../models/request';

import mongoose from 'mongoose';
import Joi from 'joi';
import wrapGen from '../../util/wrapgen'

const handler = function*(request, reply) {
  const requests = yield Request.find().exec();

  return reply({requests}).code(200);
};

export default (server, options) => {
  server.route({
    method: 'GET',
    path: '/api/requests',
    handler: wrapGen(handler),
  });
};
