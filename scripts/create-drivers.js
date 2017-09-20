"use strict";
import '../api/database';
import Driver from '../api/server/models/driver';

import co from 'co';
import _ from 'lodash';

const createDriver = function * (driverId) {
  if(driverId) {
    console.log('Creating Driver with driverId', driverId);
    const existingDriver = yield Driver.findOne({
      driverId: driverId
    }).exec();

    if(existingDriver) {
      console.log('Driver already registered');
      return existingDriver;
    }

    const driverObj = {
      driverId: driverId.trim(),
      location: [parseInt(driverId, 10), parseInt(driverId, 10)]
    };
    const driver = new Driver(driverObj);
    try {
      const addedDriver = yield driver.save();
      console.log('Driver created');
      return addedDriver;
    }
    catch(e) {
      console.log(e);
    }
    return null;
  }
}

const init = function * () {
  try {
    for(let i=0; i<5; i++) {
      yield createDriver((i+1).toString());
    }
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
};


co(init());