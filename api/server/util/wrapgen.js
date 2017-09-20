import co from 'co';

// Wraps generator so it can be used in Hapi Route Handlers
const generoute = (generator, server) => {
  const wrappedGeneratorFunc = co.wrap(generator);
  return (request, reply) => {
    wrappedGeneratorFunc(request, reply, server);
  };
};

export default generoute;
