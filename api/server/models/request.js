import Mongoose from 'mongoose';
import BaseModel from './base-model';
import autoIncrement from 'mongoose-auto-increment';

import RequestStatus, { options as RequestStatusOptions } from '../constants/request-status';

class Request extends BaseModel {
  constructor() {
    super();
    this.setSchema({
      requestId: {
        type: Number,
        unique: true,
        // required: true
      },
      driver: {
        type: {
          assigned: {
            type: Boolean,
            default: false,
            required: true
          },
          driverId: String
        },
        default: {
          assigned: false
        }
      },
      customer: {
        type: {
          customerId: String,
          location: {
            x: Number,
            y: Number
          }
        },
        required: true
      },
      status: {
        type: String,
        default: RequestStatus.WAITING,
        enum: RequestStatusOptions,
        required: true
      },
      pickedUpAt: {
        type: String
      },
      completedAt: {
        type: String
      }
    });
  }
}

Request._collection = 'Request';

const self = new Request();

self.schema.plugin(autoIncrement.plugin, {
    model: 'Request',
    field: 'requestId',
    startAt: 1000,
    incrementBy: 1
});

export default self.mongoose.model(Request._collection, self.schema);
