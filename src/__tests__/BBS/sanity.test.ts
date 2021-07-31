import { documentLoader } from '../../services/documentLoader';
import { verifiable } from '@transmute/vc.js';
import { getKey } from '../../services/keys';
import { getSuite, verificationSuites } from '../../services/suite';

it('issue / verify / present / verify', async () => {
  const key = await getKey(
    'did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb'
  );
  const suite = await getSuite(key);

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/suites/bls12381-2020/v1',
    ],
    id: 'http://example.edu/credentials/3732',
    type: ['VerifiableCredential'],
    issuer: {
      id: key.controller,
    },
    issuanceDate: '2010-01-01T19:23:24Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
  };

  const result1 = await verifiable.credential.create({
    credential,
    format: ['vc'],
    documentLoader: documentLoader,
    suite,
  });

  const result2 = await verifiable.credential.verify({
    credential: result1.items[0],
    format: ['vc'],
    documentLoader: documentLoader,
    suite: verificationSuites,
  });

  expect(result2.verified).toBe(true);

  const result3 = await verifiable.presentation.create({
    presentation: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/bls12381-2020/v1',
      ],
      type: ['VerifiablePresentation'],
      holder: key.controller,
      verifiableCredential: result1.items,
    },
    format: ['vp'],
    challenge: '123',
    documentLoader: documentLoader,
    suite,
  });

  expect(result3.items.length).toBe(1);

  const result4 = await verifiable.presentation.verify({
    presentation: result3.items[0],
    format: ['vp'],
    challenge: '123',
    documentLoader: documentLoader,
    suite: verificationSuites,
  });

  expect(result4.verified).toBe(true);
});
