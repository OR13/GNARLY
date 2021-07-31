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
  it('should throw when issuer is not supported', async () => {
    const { status, body } = await api.post('/credentials/create').send({
      credential: fixtures.credentialCase0,
    });
    expect(status).toBe(400);
    expect(body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Unsupported "issuer"',
    });
  });

  it('can create credential with JsonWebKey2020', async () => {
    const { status, body } = await api.post('/credentials/create').send({
      credential: {
        ...fixtures.credentialCase0,
        issuer: 'did:key:z6Mkg4ruYJM7N6xRagTEnZ4wQzivqkjenaGrMANqzU5LbduU',
      },
      options: {
        format: ['vc', 'vc-jwt'],
      },
    });

    expect(status).toBe(200);
    expect(body.items).toBeDefined();
  });
});

describe('POST /presentations/create', () => {
  it('can create presentation with JsonWebKey2020', async () => {
    const { status, body } = await api.post('/presentations/create').send({
      presentation: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1',
        ],
        type: ['VerifiablePresentation'],
        holder: 'did:key:z6Mkg4ruYJM7N6xRagTEnZ4wQzivqkjenaGrMANqzU5LbduU',
        verifiableCredential: fixtures.verifiableCredentialCase0.body.items,
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
        fixtures.verifiablePresentationCase0.body.items[0],
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
        fixtures.verifiablePresentationCase0.body.items[1],
      options: {
        format: ['vp-jwt'],
        challenge: '123',
      },
    });
    expect(status).toBe(200);
    expect(body.verified).toBe(true);
  });
});
