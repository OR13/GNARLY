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

describe('Presentation Exchange', () => {
  let challenge: any;
  let frame: any;
  let derivedCredential: any;
  let presentationOfDerivedCredential: any;

  describe('POST /presentations/available', () => {
    it('can notify of a presentation that is available', async () => {
      const { status, body } = await api.post('/presentations/available').send({
        query: [
          {
            type: ['VerifiableCredential', 'VaccinationCertificate'],
            reason:
              'Wallet XYZ is ready to selectively disclose new credentials.',
          },
        ],
      });

      expect(status).toBe(200);
      challenge = body.challenge;
      frame = body.query[0].credentialQuery.frame;
    });
  });

  // this stage may be done locally with 0 network requests
  describe('POST /credential/derive', () => {
    it('can derive credential with frame', async () => {
      const { status, body } = await api.post('/credentials/derive').send({
        credential: fixtures.verifiableCredentialCase1.body.items[0],
        frame,
      });
      expect(status).toBe(200);
      derivedCredential = body.items[0];
    });
  });

  // this stage may be done locally with 0 network requests
  describe('POST /presentations/create', () => {
    it('can construct presentation of derived credential', async () => {
      const { status, body } = await api.post('/presentations/create').send({
        presentation: {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/security/suites/jws-2020/v1', // for the presentation
            'https://w3id.org/security/suites/bls12381-2020/v1', // for the credential
          ],
          type: ['VerifiablePresentation'],
          holder: 'did:key:z6Mkg4ruYJM7N6xRagTEnZ4wQzivqkjenaGrMANqzU5LbduU',
          verifiableCredential: [derivedCredential],
        },
        options: {
          format: ['vp'],
          challenge: challenge, // challenge from notification response here.
        },
      });
      expect(status).toBe(200);
      presentationOfDerivedCredential = body.items[0];
    });
  });

  describe('POST /presentations/submissions', () => {
    it('can submit presentation of derived credential to verifier', async () => {
      const { status } = await api
        .post('/presentations/submissions')
        .send(presentationOfDerivedCredential);
      expect(status).toBe(200);
    });
  });
});
