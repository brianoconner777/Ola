import Request from '../../models/request';

import mongoose from 'mongoose';
import Joi from 'joi';
import wrapGen from '../../util/wrapgen'

import RequestStatus from '../../constants/request-status';

const handler = function*(request, reply) {
  const { _id } = request.payload;
  const existingRequest = yield Request.findOne({
    _id
  }).exec();
  if(!existingRequest) {
    return reply({err: 'Request does not exist in database'}).code(400);
  }
  if(existingRequest.status!==RequestStatus.WAITING) {
    return reply({validated: false}).code(200);
  }
  return reply({validated: true}).code(200);
};

export default (server, options) => {
  server.route({
    method: 'POST',
    path: '/api/request/!validate',
    config: {
      validate: {
        payload: {
          _id: Joi.string().required()
        }
      }
    },
    handler: wrapGen(handler),
  });
};
