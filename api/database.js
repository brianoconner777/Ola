import mongoose from 'mongoose';
import Config from './config';
const connectionURL = Config.get('/mongoose/mongodb/url');

mongoose.connect(connectionURL);
const db = mongoose.connection;

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
});

export default db;