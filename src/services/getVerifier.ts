// import { documentLoader} from './documentLoader'
// import jsonld from 'jsonld'
import { JsonWebKey } from '@transmute/json-web-signature'
import { JWS } from '@transmute/jose-ld'
// import { Ed25519KeyPair } from "@transmute/ed25519-key-pair";
import {defaultAssertionKey} from './keys'
//  // Note: you implement this without using JSON-LD frame,
// // but it MUST return a document with an @context.
// const documentDereferencer = async (document: any, iri: string) => {
//     try {
//       const frame = await jsonld.frame(
//         document,
//         {
//           "@context": document["@context"],
//           "@embed": "@always",
//           id: iri
//         },
//         {
//           documentLoader: (iri: string) => {
//             // use the cache of the document we just resolved when framing
//             if (iri === document.id) {
//               return {
//                 documentUrl: iri,
//                 document
//               };
//             }
//             return documentLoader(iri);
//           }
//         }
//       );
//       return {
//         documentUrl: iri,
//         document: frame
//       };
//     } catch (e) {
//       console.error("documentDereferencer frame failed on: " + iri);
//     }
//     return undefined;
//   };
export const getVerifier = async (didUrl: string)=>{
    // const { document } = await documentLoader(didUrl)
    // const key = await documentDereferencer(document, didUrl)
    console.log(didUrl)
    const k = await JsonWebKey.from(defaultAssertionKey as any)
    const [ JWA_ALG]: any = ["EdDsa", "EdDSA"];
    const verifier = JWS.createVerifier(k.verifier(), JWA_ALG);
    return verifier;
}