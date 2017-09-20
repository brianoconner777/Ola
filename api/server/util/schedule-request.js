import schedule from 'node-schedule';
import moment from 'moment';
import Request from '../models/request';
import RequestStatus from '../constants/request-status';
import Driver from '../models/driver';
import DriverStatus from '../constants/driver-status';

const freeDriver = function(driver) {
	if(driver && driver._id) {
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
	  Driver.findOneAndUpdate(updateQuery, update, updateOptions).exec((err, resp) => {
	  	if(err) {
			console.log('Error in marking driver as available');
			console.log(err);
		}
		else {
			console.log('Driver status changed successfully');
			console.log(resp);
		}
	  });
	}
}

const setRequestAsComplete = function(request, driver) {
	if(request && request._id) {
		const update = {
		    $set: {
		    }
		};
		const updateOptions = {
		    new: true
		};

		const updateQuery = {
		    _id: request._id
		};

		update.$set.status = RequestStatus.COMPLETED;
		let d = new Date();
    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ + (/* UTC+5:30 */ 5.5) * 60 * 60 * 1000);
		update.$set.completedAt = moment(d.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ')
        .format('dddd, MMMM Do YYYY, h:mm:ss a');
		Request.findOneAndUpdate(updateQuery, update, updateOptions).exec((err, resp) => {
			if(err) {
				console.log('Error in marking request as completed');
				console.log(err);
			}
			else {
				console.log('Request status changed successfully');
				console.log(resp);
				freeDriver(driver);
			}
		});
	}
}

const scheduleRequest = function(request, driver) {
	let startTime = new Date(Date.now());
	let endTime = new Date(startTime.getTime() + 300000);
	var j = schedule.scheduleJob(endTime, function(){
	  setRequestAsComplete(request, driver);
	});
}
export default scheduleRequest;