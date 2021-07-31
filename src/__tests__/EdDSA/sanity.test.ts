import {
  JsonWebKey,
  JsonWebSignature,
  JsonWebKey2020,
} from '@transmute/json-web-signature';
import { documentLoader } from '../../services/documentLoader';
import { verifiable } from '@transmute/vc.js';

const key = {
  id:
    'did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr#z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr',
  type: 'JsonWebKey2020',
  controller: 'did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'ijtvFnowiumYMcYVbaz6p64Oz6bXwe2V_9IlCgDR_38',
  },
  privateKeyJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'ijtvFnowiumYMcYVbaz6p64Oz6bXwe2V_9IlCgDR_38',
    d: 'ZrHpIW1JBb-sK2-wzKV0mQjbxpnxjUCu151QZ9_F_Vs',
  },
};

const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/suites/jws-2020/v1',
  ],
  id: 'http://example.edu/credentials/3732',
  type: ['VerifiableCredential'],
  issuer: {
    id: 'did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr',
  },
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
  },
};

it('issue / verify / present / verify', async () => {
  const result1 = await verifiable.credential.create({
    credential,
    format: ['vc', 'vc-jwt'],
    documentLoader: documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key as JsonWebKey2020),
    }),
  });

  const result2 = await verifiable.credential.verify({
    credential: result1.items[0],
    format: ['vc'],
    documentLoader: documentLoader,
    suite: [new JsonWebSignature()],
  });

  expect(result2.verified).toBe(true);

  const result3 = await verifiable.credential.verify({
    credential: result1.items[1],
    format: ['vc-jwt'],
    documentLoader: documentLoader,
    suite: new JsonWebSignature(),
  });

  expect(result3.verified).toBe(true);

  const result4 = await verifiable.presentation.create({
    presentation: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      type: ['VerifiablePresentation'],
      holder: 'did:key:z6MkokrsVo8DbGDsnMAjnoHhJotMbDZiHfvxM4j65d8prXUr',
      verifiableCredential: result1.items,
    },
    format: ['vp', 'vp-jwt'],
    challenge: '123',
    documentLoader: documentLoader,
    suite: new JsonWebSignature({
      key: await JsonWebKey.from(key as JsonWebKey2020),
    }),
  });

  expect(result4.items.length).toBe(2);

  const result5 = await verifiable.presentation.verify({
    presentation: result4.items[0],
    format: ['vp'],
    challenge: '123',
    documentLoader: documentLoader,
    suite: [new JsonWebSignature()],
  });

  expect(result5.verified).toBe(true);

  const result6 = await verifiable.presentation.verify({
    presentation: result4.items[1],
    format: ['vp-jwt'],
    challenge: '123',
    documentLoader: documentLoader,
    suite: [new JsonWebSignature()],
  });

  expect(result6.verified).toBe(true);
});
