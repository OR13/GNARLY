import { JsonWebSignature } from '@transmute/json-web-signature';
import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
} from '@mattrglobal/jsonld-signatures-bbs';

export const verificationSuites: any = [
  new JsonWebSignature(),
  new BbsBlsSignature2020(),
  new BbsBlsSignatureProof2020(),
];

export const getSuite = async (key: any) => {
  if (key.type === 'Bls12381G2Key2020') {
    return new BbsBlsSignature2020({
      key,
    });
  }
  return new JsonWebSignature({
    key,
  });
};
