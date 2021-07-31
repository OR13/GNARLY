import { FastifyInstance } from 'fastify';

import schemas from '../../schemas';
import config from '../../config';

import { registerApiDocumentation } from '../help';

const apiVersion = 'v1.0.0';
const apiSchemas = schemas[apiVersion];

import * as credential from '../../services/credential';
import * as presentation from '../../services/presentation';

export default (server: FastifyInstance, _opts: any, done: any) => {
  registerApiDocumentation(server, config, apiVersion, apiSchemas);

  server.post('/credentials/create', async (req: any, reply: any) => {
    const result = await credential.create(req.body);
    reply.send(result);
  });

  server.post('/credentials/derive', async (req: any, reply: any) => {
    const result = await credential.derive(req.body);
    reply.send(result);
  });

  server.post('/credentials/status', async (req: any, reply: any) => {
    const result = await credential.status(req.body);
    reply.send(result);
  });

  server.post('/presentations/create', async (req: any, reply: any) => {
    const result = await presentation.create(req.body);
    reply.send(result);
  });

  server.post('/presentations/verify', async (req: any, reply: any) => {
    const result = await presentation.verify(req.body);
    reply.send(result);
  });

  server.post('/presentations/available', async (req: any, reply: any) => {
    const result = await presentation.available(req.body);
    reply.send(result);
  });
  server.post('/presentations/submissions', async (req: any, reply: any) => {
    const result = await presentation.submissions(req.body);
    reply.send(result);
  });

  // server.setErrorHandler(function(error, _request, reply) {
  //   reply.send({ messae: error.message });
  // });

  done();
};
