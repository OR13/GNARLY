import { defaultAssertionKey, getKey } from './keys';
import { UnsupportedIssuer } from '../errors';
import {
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';
import { verifiable } from '@transmute/vc.js';

import { getSuite } from './suite';

import { documentLoader } from './documentLoader';

export const create = async ({
  credential,
  options,
}: {
  credential: any;
  options?: any;
}) => {
  if (!options) {
    options = {};
  }
  if (!options.format) {
    options.format = 'vc';
  }
  if (!options.assertionMethod) {
    options.assertionMethod = defaultAssertionKey.id;
  }

  const issuer = credential.issuer.id
    ? credential.issuer.id
    : credential.issuer;

  const key = await getKey(options.assertionMethod);

  if (issuer !== key.controller) {
    throw new UnsupportedIssuer(`Unsupported "issuer"`);
  }

  const suite = await getSuite(key);

  return verifiable.credential.create({
    credential,
    format: options.format,
    suite,
    documentLoader,
  });
};

export const derive = async ({ credential, frame }: any) => {
  const derived = await deriveProof(credential, frame, {
    documentLoader,
    suite: new BbsBlsSignatureProof2020(),
  });
  return { items: [derived] };
};

export const status = async ({ credentialId, credentialStatus }: any) => {
  console.log('credential status changes not suppported', {
    credentialId,
    credentialStatus,
  });
  return {};
};
