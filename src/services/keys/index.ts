import key0 from './key0.json';
import key1 from './key1.json';

import { JsonWebKey } from '@transmute/json-web-signature';

import { Bls12381G2KeyPair } from '@mattrglobal/jsonld-signatures-bbs';

export const defaultAssertionKey = key0;
export const defaultAuthenticationKey = key0;

export const getKey = async (id: string) => {
  if (id === defaultAssertionKey.id) {
    return JsonWebKey.from(defaultAssertionKey as any);
  }
  if (id === key1.id) {
    return Bls12381G2KeyPair.from(key1 as any);
  }
  throw new Error('Cannot get key by id: ' + id);
};
