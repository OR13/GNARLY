import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const getSchemas = (version: string) => {
  const test = fs.existsSync(
    path.resolve(__dirname, `./spec/${version}/openapi.yaml`)
  );

  const schemaRoot = test
    ? path.resolve(__dirname, `./spec/${version}/schemas`)
    : path.resolve(__dirname, `../spec/${version}/schemas`);

  const dirContents = fs
    .readdirSync(schemaRoot)
    .filter((fileName: string) => {
      return !fileName.startsWith('_');
    })
    .map(fileName => {
      return yaml.load(
        fs.readFileSync(path.join(schemaRoot, `${fileName}`), 'utf8').toString()
      );
    });

  const schemas: any = {};

  const requiredSchemaFields = ['title', 'description'];

  dirContents.forEach((schema: any) => {
    for (const rf of requiredSchemaFields) {
      if (!schema[rf]) {
        throw new Error(
          `A schema is missing a required field: ${rf}\n${JSON.stringify(
            schema,
            null,
            2
          )}`
        );
      }
    }

    schemas[schema.title] = schema;
  });

  return schemas;
};
