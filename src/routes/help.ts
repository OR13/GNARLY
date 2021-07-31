import fs from 'fs';
import path from 'path';

export const registerApiDocumentation = (
  server: any,
  config: any,
  version: string,
  apiSchemas: any
) => {
  const test = fs.existsSync(
    path.resolve(__dirname, `./spec/${version}/openapi.yaml`)
  );

  const apiSpecRoot = test
    ? path.resolve(__dirname, `./spec/${version}/openapi.yaml`)
    : path.resolve(__dirname, `../spec/${version}/openapi.yaml`);

  server.register(require('fastify-swagger'), {
    mode: 'static',
    specification: {
      path: apiSpecRoot,
      postProcessor: function(swaggerObject: any) {
        swaggerObject.servers[0].url =
          config.apiVersion === version
            ? config.apiRoot
            : config.apiRoot + '/api/' + version + '/';
        swaggerObject.components.schemas = apiSchemas;
        return swaggerObject;
      },
    },
    routePrefix: `/api/docs`,
    exposeRoute: true,
    // see: https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
    },
  });
};
