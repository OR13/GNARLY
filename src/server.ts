import path from 'path';
import fastify from 'fastify';
import routes from './routes';

const server = fastify({ ignoreTrailingSlash: true });

server.register(routes['v1.0.0'], { prefix: '/' });
server.register(routes['v1.0.0'], { prefix: '/api/v1.0.0' });

server.get('/', (_req: any, reply) => {
  reply.redirect('/api/docs');
});

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'spec/v1.0.0/schemas'),
  prefix: '/api/schemas/', // optional: default '/'
});

export default server;
