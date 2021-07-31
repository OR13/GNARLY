import cre from '@transmute/credentials-context';
import sec from '@transmute/security-context';
import did from '@transmute/did-context';

import vax from './vax-v1.json';

export const contexts: any = {
  // did contexts
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),

  // credential contexts
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),

  // credential suites
  [sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sec.contexts.get(
    sec.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),

  [sec.constants.BLS12381_2020_V1_URL]: sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),

  // security contexts... these are required by mattr suite... but should not be
  'https://w3id.org/security/bbs/v1': sec.contexts.get(
    sec.constants.BLS12381_2020_V1_URL
  ),
  'https://w3id.org/security/v2': sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  'https://w3id.org/security/v1': sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),

  //credential vocabularies
  'https://w3id.org/vaccination/v1': vax,
};
