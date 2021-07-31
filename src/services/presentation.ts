import { v4 as uuidv4 } from 'uuid';
import { defaultAuthenticationKey, getKey } from './keys';
import { UnsupportedHolder, ChallengeRequired } from '../errors';

import { verifiable } from '@transmute/vc.js';

import { getSuite, verificationSuites } from './suite';

import { documentLoader } from './documentLoader';

export const create = async ({
  presentation,
  options,
}: {
  presentation: any;
  options?: any;
}) => {
  if (!options) {
    options = {};
  }
  if (!options.format) {
    options.format = 'vp';
  }
  if (!options.authentication) {
    options.authentication = defaultAuthenticationKey.id;
  }

  const holder = presentation.holder.id
    ? presentation.holder.id
    : presentation.holder;

  const key = await getKey(options.authentication);

  if (holder !== key.controller) {
    throw new UnsupportedHolder(`Unsupported "holder"`);
  }

  const suite = await getSuite(key);

  return verifiable.presentation.create({
    presentation,
    format: options.format,
    suite,
    challenge: options.challenge,
    documentLoader,
  });
};

export const verify = async ({
  verifiablePresentation,
  options,
}: {
  verifiablePresentation: any;
  options?: any;
}) => {
  if (!options) {
    options = {};
  }
  if (!options.format) {
    options.format = 'vp';
  }
  if (!options.challenge) {
    throw new ChallengeRequired(
      `Presentation verification requires "challenge"`
    );
  }
  return verifiable.presentation.verify({
    presentation: verifiablePresentation,
    format: options.format,
    challenge: options.challenge,
    suite: verificationSuites,
    documentLoader,
  });
};

export const available = async ({ query }: any) => {
  return {
    domain: 'verifier.example.com',
    challenge: uuidv4(),
    query: [
      {
        type: 'QueryByFrame',
        credentialQuery: {
          // see also https://identity.foundation/waci-presentation-exchange/#appendix
          frame: {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://w3id.org/security/suites/bls12381-2020/v1',
              'https://w3id.org/vaccination/v1',
            ],
            type: query[0].type, // usually you would validate this, before accepting it
            credentialSubject: {
              '@explicit': true,
              type: ['VaccinationEvent'],
              batchNumber: {},
              countryOfVaccination: {},
            },
          },
        },
      },
    ],
  };
};

export const submissions = async (presentation: any) => {
  // TODO: here is where the verifier checks:
  // 1. the presentation is valid
  // 2. the challenge is correct
  // 3. the presenation is stored successfully
  return verify({
    verifiablePresentation: presentation,
    options: {
      challenge: presentation.proof.challenge,
    },
  });
};
