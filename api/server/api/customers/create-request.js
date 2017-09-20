import Request from '../../models/request';

import mongoose from 'mongoose';
import Joi from 'joi';
import wrapGen from '../../util/wrapgen'

const handler = function*(request, reply) {
  const { customerId, location } = request.payload;
  
  const requestObj = {
    customer: {
      customerId,
      location: {
        x: parseInt(location.x, 10),
        y: parseInt(location.y, 10)
      }
    }
  }; 

  try {
    const createdRequest = new Request(requestObj);
    const savedRequest = createdRequest.save();
    return reply(savedRequest).code(200);
  }
  catch(e) {
    console.log(e);
  }

  return reply({err: 'something went wrong'}).code(500);
};

export default (server, options) => {
  server.route({
    method: 'POST',
    path: '/api/request',
    config: {
      validate: {
        payload: {
          customerId: Joi.string().required(),
          location: Joi.object().keys({
            x: Joi.string().required(),
            y: Joi.string().required()
          }).required()
        }
      }
    },
    handler: wrapGen(handler),
  });
};
