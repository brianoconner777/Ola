import Request from '../../models/request';
import Driver from '../../models/driver';

import mongoose from 'mongoose';
import Joi from 'joi';
import wrapGen from '../../util/wrapgen'

import RequestStatus from '../../constants/request-status';
import DriverStatus from '../../constants/driver-status';

const isDriverEligible = function*(waitingRequest, driverId) {
  let isEligible = false;
  try {
    const topEligibleDrivers = yield Driver.find({
      status: DriverStatus.AVAILABLE,
      location: {
        $near: {
          $geometry: {
            type: 'POINT',
            coordinates: [waitingRequest.customer.location.x, waitingRequest.customer.location.y]
          }
        }
      }
    })
    .limit(3)
    .exec();
    console.log(topEligibleDrivers);
    for(const eligibleDriver of topEligibleDrivers) {
      if(eligibleDriver.driverId === driverId) {
        isEligible = true;
        break;
      }
    }
  }
  catch(e) {
    console.log(e);
  }
  return isEligible;
}

const handler = function*(request, reply) {
  const { driverId } = request.query;
  
  const requestsWaiting = yield Request.find({
    'driver.assigned': false
  }).exec();

  const finalRequests = [];
  for(const waitingRequest of requestsWaiting) {
    const isEligible = yield isDriverEligible(waitingRequest, driverId);
    if(isEligible) {
      finalRequests.push(waitingRequest);
    }
  }

  const requestsOngoing = yield Request.find({
    'driver.driverId': driverId.toString(),
    status: RequestStatus.ONGOING
  }).exec();

  const requestsCompleted = yield Request.find({
    'driver.driverId': driverId,
    status: RequestStatus.COMPLETED
  }).exec();

  return reply({
    waiting: finalRequests, 
    ongoing: requestsOngoing, 
    completed: requestsCompleted
  }).code(200);
};

export default (server, options) => {
  server.route({
    method: 'GET',
    path: '/api/requests/!driver',
    config: {
      validate: {
        query: {
          driverId: Joi.string().required()
        }
      }
    },
    handler: wrapGen(handler),
  });
};
