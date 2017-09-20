import Request from '../../models/request';
import Driver from '../../models/driver';

import mongoose from 'mongoose';
import moment from 'moment';
import Joi from 'joi';
import wrapGen from '../../util/wrapgen'

import RequestStatus from '../../constants/request-status';
import DriverStatus from '../../constants/driver-status';
import scheduleRequest from '../../util/schedule-request';

const setDriverAsAssigned = function*(driverId) {
  const update = {
    $set: {
    }
  };
  const updateOptions = {
    new: true
  };

  const updateQuery = {
    driverId
  };

  update.$set.status = DriverStatus.ASSIGNED;
  const updatedDriver = yield Driver.findOneAndUpdate(updateQuery, update, updateOptions).exec();
  return updatedDriver;
}

const freeDriver = function*(driver) {
  const update = {
    $set: {
    }
  };
  const updateOptions = {
    new: true
  };

  const updateQuery = {
    _id: driver._id
  };

  update.$set.status = DriverStatus.AVAILABLE;
  const updatedDriver = yield Driver.findOneAndUpdate(updateQuery, update, updateOptions).exec();
  return updatedDriver;
}

const handler = function*(request, reply) {
  const { _id, driverId } = request.payload;
  const existingRequest = yield Request.findOne({
    _id
  }).exec();
  if(!existingRequest) {
    return reply({err: 'Request does not exist in database'}).code(400);
  }
  if(existingRequest.status!==RequestStatus.WAITING) {
    return reply({err: 'Request not in waiting state.'}).code(400);
  }
  const pendingDriverRequest = yield Request.findOne({
    status: RequestStatus.ONGOING,
    'driver.driverId': driverId
  }).exec();
  if(pendingDriverRequest) {
    return reply({err: 'Driver has an ongoing request assigned'}).code(400);
  }
  const updatedDriver = yield setDriverAsAssigned(driverId);
  if(updatedDriver) {
    const update = {
      $set: {
      }
    };
    const updateOptions = {
      new: true
    };

    const updateQuery = {
      _id
    };

    update.$set.driver = {
      assigned: true,
      driverId
    };
    update.$set.status = RequestStatus.ONGOING;

    let d = new Date();
    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ + (/* UTC+5:30 */ 5.5) * 60 * 60 * 1000);
    update.$set.pickedUpAt = moment(d.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ')
          .format('dddd, MMMM Do YYYY, h:mm:ss a');
    
    const updatedRequest = yield Request.findOneAndUpdate(updateQuery, update, updateOptions).exec();
    if(updatedRequest && updatedRequest.driver.assigned) {
      scheduleRequest(updatedRequest, updatedDriver);
      return reply({updatedRequest}).code(200);  
    }
    else {
      yield freeDriver(updatedDriver);
    }
  }
  return reply({err: 'Could not assign driver.'}).code(400);
};

export default (server, options) => {
  server.route({
    method: 'POST',
    path: '/api/request/!accept',
    config: {
      validate: {
        payload: {
          _id: Joi.string().required(),
          driverId: Joi.string().required()
        }
      }
    },
    handler: wrapGen(handler),
  });
};
