import server from '../../server';
import supertest from 'supertest';
import * as fixtures from '../../__fixtures__';

let api: any;

beforeAll(async () => {
  api = await supertest(server.server);
  await server.ready();
});

afterAll(async () => {
  await server.close();
});

describe('POST /credentials/create', () => {
  it('can create credential with Bls12381G2Key2020', async () => {
    const { status, body } = await api.post('/credentials/create').send({
      credential: {
        ...fixtures.credentialCase1,
        issuer: {
          id:
            'did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9',
        },
      },
      options: {
        format: ['vc'],
        assertionMethod:
          'did:key:z5TcDVRemCWTd6qwxxhFeYDpQhK4pUYtuutodKP2MSDjzcqokf6cNCARsaF8JNZQ8FzWAYfFZbUqUCUDMWeWp8xVkRSr9z5Tf5k2tJgpjsqNM23E4VjHsCzN6WcSvLGKSA9VEMTc1d2F81mCCauerPY1VC8vPTkvtmEQZfmaZ54x15PJwbhkBxaEbydWjd7D2CWHbkFg9#zUC7GEUemCyub4Q5mAhXkNZVcVrCWz57UvxaYrd2o8iBfDMhJhAVc5U47x5J55kYHVhud5oWFXC4DyeywbcKLaqi2NjbyMgTREk8J6ypRU9drJBnVXXboReHLhhd1T4QU21Gzhb',
      },
    });
    expect(status).toBe(200);
    expect(body.items).toBeDefined();
  });
});

describe('POST /credentials/derive', () => {
  it('can create credential with BbsBlsSignature2020', async () => {
    const { status, body } = await api.post('/credentials/derive').send({
      credential: fixtures.verifiableCredentialCase1.body.items[0],
      frame: fixtures.frame0,
    });
    expect(status).toBe(200);
    expect(body.items).toBeDefined();
    expect(body.items[0].proof.type).toBe('BbsBlsSignatureProof2020');
  });
});

describe('POST /presentations/create', () => {
  it('can create presentation with JsonWebKey2020', async () => {
    const { status, body } = await api.post('/presentations/create').send({
      presentation: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1', // for the presentation
          'https://w3id.org/security/suites/bls12381-2020/v1', // for the credential
        ],
        type: ['VerifiablePresentation'],
        holder: 'did:key:z6Mkg4ruYJM7N6xRagTEnZ4wQzivqkjenaGrMANqzU5LbduU',
        verifiableCredential: [
          fixtures.verifiableCredentialCase2.body.items[0],
        ],
      },
      options: {
        format: ['vp', 'vp-jwt'],
        challenge: '123',
      },
    });

    expect(status).toBe(200);
    expect(body.items).toBeDefined();
  });
});

describe('POST /presentations/verify', () => {
  it('can verify vp presentation with JsonWebKey2020', async () => {
    const { status, body } = await api.post('/presentations/verify').send({
      verifiablePresentation:
        fixtures.verifiablePresentationCase1.body.items[0],
      options: {
        format: ['vp'],
        challenge: '123',
      },
    });

    expect(status).toBe(200);
    expect(body.verified).toBe(true);
  });

  it('can verify vp-jwt presentation with JsonWebKey2020', async () => {
    const { status, body } = await api.post('/presentations/verify').send({
      verifiablePresentation:
        fixtures.verifiablePresentationCase1.body.items[1],
      options: {
        format: ['vp-jwt'],
        challenge: '123',
      },
    });

    expect(status).toBe(200);
    expect(body.verified).toBe(true);
  });
});
