// Wraps generator so it can be used in Hapi responses
import co from 'co';

export default (generator) => {
  const handler = co.wrap(generator);
  return (request, reply, callback) => {
    handler.bind(this)(request, reply, callback)
      .then(reply)
      .catch(reply);
  };
};
