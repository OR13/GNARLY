import { contexts } from './contexts';

// import jsonld from "jsonld";

import { resolve } from '@transmute/did-key.js';

const contextResolver = async (iri: string) => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }
  return undefined;
};

const documentResolver = async (iri: string) => {
  // because mattr suite does not verify from JWKs...
  if (iri.startsWith('did:key:z5T')) {
    const { didDocument } = await resolve(iri.split('#')[0], {
      accept: 'application/did+ld+json',
    });
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }
  if (iri.startsWith('did:key')) {
    const { didDocument } = await resolve(iri.split('#')[0], {
      accept: 'application/did+json',
    });
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }
  return undefined;
};

export const documentLoader = async (iri: string) => {
  const context = await contextResolver(iri);
  if (context) {
    return context;
  }

  const resolution = await documentResolver(iri);

  if (resolution) {
    return resolution;
  }

  const message = 'Unsupported iri: ' + iri;
  console.error(message);
  throw new Error(message);
};
