import request from 'superagent';

function getUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if(typeof(window)!='undefined') {
    const apiPath = `http://${window.location.hostname}:3000/api${adjustedPath}`;
    return apiPath;
  }
  return 'http://localhost:3000/api' + adjustedPath;
}

const HttpClient = {

  get: (path, payload = {}) => new Promise((resolve, reject) => {
    request
      .get(getUrl(path))
      .query(payload)
      // .withCredentials()
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  put: (path, payload = {}) => new Promise((resolve, reject) => {
    request
      .put(getUrl(path))
      // .withCredentials()
      .send(payload)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  post: (path, payload = {}) => new Promise((resolve, reject) => {
    request
      .post(getUrl(path))
      // .withCredentials()
      .send(payload)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  delete: (path) => new Promise((resolve, reject) => {
    request
      .del(getUrl(path))
      // .withCredentials()
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  }),

};

export default HttpClient;
