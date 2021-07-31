const Environment = require('jest-environment-jsdom');
const { BbsBlsSignature2020 } = require('@mattrglobal/jsonld-signatures-bbs');

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }

    this.global.BbsBlsSignature2020 = BbsBlsSignature2020;
  }
};
