import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Config from './config';
const connectionURL = Config.get('/mongoose/mongodb/url');

mongoose.connect(connectionURL);
const db = mongoose.connection;

const initializeDB = (callback) => {
	db.on('error', () => {
	  console.log('Mongoose connection error');
	});

	db.on('connected', () => {
	  console.log('Mongoose connected');
	});

	db.on('disconnected', () => {
	  console.log('Mongoose disconnected');
	});

	db.once('open', (dbErr) => {
	  if (dbErr) {
	    throw dbErr;
	  }
	  console.log('Db Connection established!');
	  autoIncrement.initialize(db);
	  if(callback) {
	  	callback(db);
	  }
	});
}

export default initializeDB;