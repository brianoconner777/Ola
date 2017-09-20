import Mongoose from 'mongoose';
import BaseModel from './base-model';

import DriverStatus, { options as DriverStatusOptions } from '../constants/driver-status';

class Driver extends BaseModel {
  constructor() {
    super();
    this.setSchema({
      driverId: {
        type: String,
        unique: true,
        trim: true,
        required: true
      },
      status: {
        type: String,
        enum: DriverStatusOptions,
        default: DriverStatus.AVAILABLE,
        required: true
      },
      location: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2dsphere',
        required: true
      }
    });
    this.setIndexes({
      location: '2dsphere'
    });
  }
}

Driver._collection = 'Driver';

const self = new Driver();

export default self.mongoose.model(Driver._collection, self.schema);
