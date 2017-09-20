import Config from './config';
import composer from './index';
// import './database';
import initializeDB from './initializeDB';

initializeDB((db) => {
  composer((err, server) => {
    if (err) {
      console.log(err);
      server.error(err);
    }

    try {
      server.start((err) => {
        if (err) {
          console.log(err);
        }
        server.log('Started the API server', server.info);
        server.log('==> 🌎  API is running on port: ', Config.get('/port/api'));
      });
    } catch (err) {
      console.log(err);
    }
  });
});
