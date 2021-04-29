
const { Test } = require('./testutils');
const { randomBytes } = require('crypto');
const {
  Wots,
  DEFAULT_TAG,
  TRANLEN,
  TXADDRLEN
} = require('../src/mochimo');

// data sources
const Genseed = randomBytes(32);
const Gensrc = Wots.generate(Genseed);
const Gencmp = Wots.generate();
const Signmsg = randomBytes(TRANLEN);
const Signgen = Wots.sign(Signmsg, Gensrc.secret);
const Signcmp = Wots.sign(Signmsg, Gencmp.secret);
const PkgenPubseed = new Uint8Array(Gensrc.address.buffer, Wots.PUBSEEDp, 32);
const PkgenAddr = new Uint8Array(Gensrc.address.buffer, Wots.ADDRp, 32);
const PkcmpPubseed = new Uint8Array(Gencmp.address.buffer, Wots.PUBSEEDp, 32);
const PkcmpAddr = new Uint8Array(Gencmp.address.buffer, Wots.ADDRp, 32);
const Pkgen = Wots.pkFromSig(Signgen, Signmsg, PkgenPubseed, PkgenAddr);
const Pkcmp = Wots.pkFromSig(Signcmp, Signmsg, PkcmpPubseed, PkcmpAddr);
const VerifyTrue = Wots.verify(Signgen, Signmsg, Gensrc.address);
const VerifyFalse = Wots.verify(Signgen, Signmsg, Gencmp.address);

// execute base configuration tests
module.exports = {
  'Wots.generate(seed)': [
    Test(typeof Gensrc, 'exactly', 'object', 'Return value type'),
    Test(Gensrc?.address, 'instanceof', Uint8Array, 'WOTS+ address type'),
    Test(Gensrc?.address?.length, 'exactly', TXADDRLEN, 'WOTS+ address length'),
    Test(Buffer.from(Gensrc?.address?.subarray(2196) || [])?.toString('hex'),
      'exactly', DEFAULT_TAG, 'WOTS+ address default Tag'),
    Test(Gensrc?.secret, 'instanceof', Uint8Array, 'WOTS+ secret type'),
    Test(Gensrc?.secret?.length, 'exactly', 32, 'WOTS+ secret length'),
    Test(Gensrc?.address, 'exactlynot', Gencmp?.address, 'Non-dup address'),
    Test(Gensrc?.secret, 'exactlynot', Gencmp?.secret, 'Non-dup secret'),
    Test(Gensrc, 'exactly', Wots.generate(Genseed), 'Seed consistency')
  ],
  'Wots.sign(message, secret)': [
    Test(Signgen, 'instanceof', Uint8Array, 'WOTS+ signature type'),
    Test(Signgen?.length, 'exactly', Wots.SIGLEN, 'WOTS+ signature length'),
    Test(Signgen, 'exactlynot', Signcmp, 'Non-dup signature'),
    Test(Signgen, 'exactly', Wots.sign(Signmsg, Gensrc?.secret),
      'Wots+ signature consistency')
  ],
  'Wots.pkFromSig(signature, message, pubSeed, addr)': [
    Test(Pkgen, 'instanceof', Uint8Array, 'WOTS+ pk type'),
    Test(Pkgen?.length, 'exactly', Wots.SIGLEN, 'WOTS+ pk length'),
    Test(Pkgen, 'exactlynot', Pkcmp, 'Non-dup signature'),
    Test(Pkgen, 'exactly', new Uint8Array(Gensrc?.address?.buffer ||
      new ArrayBuffer(Wots.SIGLEN), 0, Wots.SIGLEN), 'Result is as expected'),
    Test(Pkgen, 'exactly',
      Wots.pkFromSig(Signgen, Signmsg, PkgenPubseed, PkgenAddr),
      'WOTS+ pk consistency')
  ],
  'Wots.verify(signature, message, address)': [
    Test(VerifyFalse, 'exactly', false, 'Verify false'),
    Test(VerifyTrue, 'exactly', true, 'Verify true')
  ]
};
