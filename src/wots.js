
/* requirements */
const { createHash, randomBytes } = require('crypto');
const { LOG, sanitizeUint8Array } = require('./util');
const { TXADDRLEN } = require('./constants.js');

/* private WOTS+ constants */
const PARAMSN = 32;
const WOTSW = 16;
const WOTSLOGW = 4;
const WOTSLEN1 = (8 * PARAMSN / WOTSLOGW);
const WOTSLEN2 = 3;
const WOTSLEN = (WOTSLEN1 + WOTSLEN2);
const WOTSSIGBYTES = (WOTSLEN * PARAMSN);
const XMSS_HASH_PADDING_F = 0;
const XMSS_HASH_PADDING_PRF = 3;
const Sigbytes = WOTSSIGBYTES; // unnecessary, but makes code cleaner
const csumArrayLength = parseInt((WOTSLEN2 * WOTSLOGW + 7) / 8);

/* private arrays used in WOTS+ functions, as globals for performance */
const prfbuf = new Uint8Array((2 * PARAMSN) + 32);
const thashfbuf = new Uint8Array(3 * PARAMSN);
const thashfbitmask = new Uint8Array(PARAMSN);
const thashfaddrAsBytes = new Uint8Array(32);

/* private WOTS+ helper functions */
// cleanup data left in globals used by WOTS+ functions (for security)
const cleanupGlobals = () => {
  prfbuf.fill(0);
  thashfbuf.fill(0);
  thashfbitmask.fill(0);
  thashfaddrAsBytes.fill(0);
};

// converts the value of 'input' to 'outlen' bytes in big-endian byte order?
const ull2Bytes = (outArray, outlen, input) => { // ull_to_bytes() from wots.c
  for (let i = outlen - 1; i >= 0; i--) {
    outArray[i] = input & 0xff;
    input = input >>> 8;
  }
};

// loop-forwarder function for converting addr arrays to bytes using ull2Bytes()
const addr2Bytes = (outArray, addr32) => {
  for (let i = 0; i < 8; i++) {
    const begin = i * 4;
    ull2Bytes(outArray.subarray(begin, begin + 4), 4, addr32[i]);
  }
};

// computes PRF(key, in), for a key of PARAMSN bytes, and a 32-byte input
const prf = (outArray, inArray, keyArray) => { // prf() from wotshash.c
  // const buf = new Uint8Array((2 * PARAMSN) + 32); // moved to global array
  ull2Bytes(prfbuf, PARAMSN, XMSS_HASH_PADDING_PRF);
  prfbuf.set(keyArray, PARAMSN);
  prfbuf.set(inArray, 2 * PARAMSN);
  outArray.set(createHash('sha256').update(prfbuf).digest());
};

// expands an n-byte array into a len*n byte array using the `prf` function
const expandSecret = (pk, secret) => { // expand_seed() from wots.c
  const ctr = new Uint8Array(32);
  for (let i = 0; i < WOTSLEN; i++) {
    ull2Bytes(ctr, 32, i);
    const begin = i * PARAMSN;
    prf(pk.subarray(begin, begin + 32), ctr, secret);
  }
};

// internal key lengthening using the `sha512` function
const rndBytes = (outArray, outlen, seed) => {
  if (typeof seed === 'undefined') {
    throw new Error('Internal Wots Error: rndBytes() MUST BE SEEDED!!!');
  }
  let state = seed; // define intermediate update state
  for (let i = 0, n = 0; outlen > 0; i += n, outlen -= n) {
    const digest = createHash('sha512').update(state).update(seed).digest();
    n = (outlen < 32) ? outlen : 32;
    outArray.set(digest.subarray(0, n), i); // first 256-bits for outArray
    state = digest.subarray(32, 64); // last 256-bits for intermediate state
  }
};

// unknown function, no description...
const thashf = (outArray, pubSeed, addr32) => { // thash_f() from wotshash.c
  // const buf = new Uint8Array(3 * PARAMSN); // moved to global array
  // const bitmask = new Uint8Array(PARAMSN); // moved to global array
  // const addrAsBytes = new Uint8Array(32); // moved to global array
  // set the function padding
  ull2Bytes(thashfbuf, PARAMSN, XMSS_HASH_PADDING_F);
  // generate the n-byte key
  addr32[7] = 0; // setKeyAndMask(addr32, 0); // carried from wotshash.c
  addr2Bytes(thashfaddrAsBytes, addr32);
  prf(thashfbuf.subarray(PARAMSN, PARAMSN + 32), thashfaddrAsBytes, pubSeed);
  /* Generate the n-byte mask. */
  addr32[7] = 1; // setKeyAndMask(addr32, 1); // carried from wotshash.c
  addr2Bytes(thashfaddrAsBytes, addr32);
  prf(thashfbitmask, thashfaddrAsBytes, pubSeed);
  // perform thash_f?
  for (let i = 0; i < PARAMSN; i++) {
    thashfbuf[(2 * PARAMSN) + i] = outArray[i] ^ thashfbitmask[i];
  }
  // perform sha256 hash of 'buf' and store digest in outArray
  outArray.set(createHash('sha256').update(thashfbuf).digest());
};

// computes the chaining function (addr has to contain the address of the chain)
const generateChain = (outArray, inArray, start, steps, pubSeed, addr32) => {
  outArray.set(inArray);
  const stop = start + steps;
  for (let i = start; i < stop && i < WOTSW; i++) {
    addr32[6] = i; // SetHashAddr(addr32, i); // carried from wotshash.c
    thashf(outArray, pubSeed, addr32);
  }
};

// Interprets an array of bytes as integers in base w
// *This only works when log_w is a divisor of 8
const baseW = (output32Array, outlen, inputArray) => {
  let consumed, i, out, total, bits;
  for (consumed = i = out = bits = 0; consumed < outlen; consumed++) {
    if (bits === 0) {
      total = inputArray[i++];
      bits += 8;
    }
    bits -= WOTSLOGW;
    output32Array[out++] = (total >>> bits) & (WOTSW - 1);
  }
};

// computes the WOTS+ checksum over a message (in baseW)
const wotsChecksum = (csumBaseW32Array, msgBaseW32Array) => {
  // const csumArray = new Uint8Array(parseInt((WOTSLEN2 * WOTSLOGW + 7) / 8));
  const csumArray = new Uint8Array(csumArrayLength);
  let csum = 0; // compute checksum
  for (let i = 0; i < WOTSLEN1; i++) {
    csum += WOTSW - 1 - msgBaseW32Array[i];
  } // convert checksum to baseW...
  // ... ensuring expected empty zero bits are the least significant bits
  csum <<= 4; // 8 - ((WOTSLEN2 * WOTSLOGW) % 8);
  ull2Bytes(csumArray, csumArray.length, csum);
  baseW(csumBaseW32Array, WOTSLEN2, csumArray);
};

// takes a message and derives the matching chain lengths
const chainLengths = (lengths32Array, msgArray) => {
  baseW(lengths32Array, WOTSLEN1, msgArray);
  wotsChecksum(lengths32Array.subarray(WOTSLEN1), lengths32Array);
};

/**
 * @typicalname wots
 * @classdesc The Wots class provides utility functions to generate, sign and
 * verify WOTS+ addresses used by the Mochimo Network Blockchain, as well as a
 * few pointer constants for positions of intra-address components. */
class Wots {
  /**
   * Generate a WOTS+ address and secret pair, with or without a seed.
   * @param {external:Uint8Array=} seed Array of binary data (preferably random)
   * <br><sup>*If no seed is supplied, a 32-byte CSPRNG seed will be provided.*
   * @return {external:Object}
   * <br>`Object.address`: The generated WOTS+ address,
   * <br>`Object.secret`: The secret key associated with the address
   * @example example file
   * const { Wots } = require('mochimo');
   * const { randomBytes } = require('crypto');
   *
   * const wots = Wots.generate(randomBytes(32));
   * console.log('WOTS+ address:', Buffer.from(wots.address).toString('hex'));
   * console.log('WOTS+ secret:', wots.secret); */
  static generate (seed) {
    const fid = LOG.debug(`Wots.generate(${seed ? 'seeded' : ''})`);
    // generte entropy from CSPRNG, or sanitize input if entropy is provided
    LOG.debug(fid, 'check parameters...');
    if (typeof seed === 'undefined') {
      LOG.debug(fid, 'generate entropy using CSPRNG...');
      seed = randomBytes(32);
    } else seed = sanitizeUint8Array(fid, { seed });
    // define Uint8Arrays: secret, pk, public seed (pk.buffer) and addr
    const secret = new Uint8Array(32);
    const pk = new Uint8Array(TXADDRLEN);
    const pubSeed = new Uint8Array(pk.buffer, Sigbytes, 32);
    const addr = new Uint8Array(32);
    // define Uint32Array: addr32 (addr.buffer)
    const addr32 = new Uint32Array(addr.buffer);
    // expand seed to secret and public key/seed/addr
    LOG.debug(fid, 'expand seed to secret and pk...');
    rndBytes(secret, 32, seed);
    rndBytes(pk, TXADDRLEN, secret);
    // copy addr segment from pk
    addr.set(pk.subarray(Sigbytes + 32));
    // expand secret to WOTS+ private key, processed in pk
    LOG.debug(fid, 'expand secret to WOTS+ private key...');
    expandSecret(pk, secret);
    // generate WOTS+ public key from private key
    LOG.debug(fid, 'generate WOTS+ address...');
    for (let i = 0; i < WOTSLEN; i++) {
      const pkpart = new Uint8Array(pk.buffer, i * PARAMSN, PARAMSN);
      addr32[5] = i; // SetChainAddr(addr32, i); // carried from wotshash.c
      generateChain(pkpart, pkpart, 0, WOTSW - 1, pubSeed, addr32);
    } // cleanup
    cleanupGlobals();
    // return modified addr segment in pk (applies default tag)
    pk.set(addr, Sigbytes + 32);
    // return pk and secret in Object as WOTS+ address and secret key
    return { address: pk, secret };
  }

  /**
   * Generate&ast; a WOTS+ public address key from a WOTS+ signature.
   * <br><sup>&astMust have access to signed message, and Public Seed and ADDR
   * portions of the full WOTS+ address.
   * @param {external:Uint8Array} signature The WOTS+ signature
   * @param {external:Uint8Array} message The message used to sign
   * @param {external:Uint8Array} pubSeed Public Seed portion of WOTS+ address
   * <br><sup>&ast;32 bytes starting at byte 2144 of WOTS+ address
   * @param {external:Uint8Array} addr ADDR portion of WOTS+ address
   * <br><sup>&ast;32 bytes starting at byte 2176 of WOTS+ address
   * @return {external:Uint8Array} Public key portion of WOTS+ address
   * @throws {TypeError} when __signature__ is not 2144 bytes long
   * @throws {TypeError} when __pubSeed__ is not 32 bytes long
   * @throws {TypeError} when __addr__ is not 32 bytes long
   * @example
   * const { Wots, constants } = require('mochimo');
   * const { randomBytes } = require('crypto');
   *
   * const pkSecret = Wots.generate();
   * const message = randomBytes(constants.TRANLEN);
   * const signature = Wots.sign(message, pkSecret.secret);
   * const pubSeed = pkSecret.address.subarray(Wots.PUBSEEDp, 32);
   * const addr = pkSecret.address.subarray(Wots.ADDRp, 32);
   * const pkFromSig = Wots.pkFromSig(signature, message, pubSeed, addr);
   * console.log(pkFromSig.some((curr, i) => curr !== pkSecret.address[i]
   *   ? 'result is different' : 'result is identical'); */
  static pkFromSig (signature, message, pubSeed, addr) {
    const fid = LOG.debug('Wots.pkFromSig()');
    // check and sanitize input arrays
    LOG.debug(fid, 'check parameters...');
    signature = sanitizeUint8Array(fid, { signature }, Sigbytes, Sigbytes);
    message = sanitizeUint8Array(fid, { message });
    pubSeed = sanitizeUint8Array(fid, { pubSeed }, 32, 32);
    addr = sanitizeUint8Array(fid, { addr }, 32, 32);
    // define Uint8Array: pkFromSig
    const pkFromSig = new Uint8Array(Sigbytes);
    // define Uint32Arrays: lengths32 and addr32 (addr.buffer)
    const lengths32 = new Uint32Array(WOTSLEN);
    const addr32 = new Uint32Array(addr.buffer);
    // create sha256 hash of message for signing
    LOG.debug(fid, 'hash message...');
    const hash = createHash('sha256').update(message).digest();
    // derive matching chain lengths from hashed message
    chainLengths(lengths32, hash);
    // generate WOTS+ public key from signature
    LOG.debug(fid, 'generate WOTS+ address from signature...');
    for (let i = 0; i < WOTSLEN; i++) {
      const pkpart = new Uint8Array(pkFromSig.buffer, i * PARAMSN, PARAMSN);
      const sigpart = new Uint8Array(signature.buffer, i * PARAMSN, PARAMSN);
      const steps = WOTSW - 1 - lengths32[i];
      addr32[5] = i; // SetChainAddr(addr32, i); // carried from wotshash.c
      generateChain(pkpart, sigpart, lengths32[i], steps, pubSeed, addr32);
    } // cleanup
    cleanupGlobals();
    // return pk as WOTS+ public key (derived from signature)
    return pkFromSig;
  }

  /**
   * Generate a WOTS+ Signature from a message and secret.
   * @param {external:Uint8Array} message The message to be signed
   * @param {external:Uint8Array} secret A secret&ast;<br><sup>&ast;Must have
   * been generated by `Wots.generate()`
   * @return {external:Uint8Array} A WOTS+ Signature
   * @example
   * const { Wots, TRANLEN } = require('mochimo');
   * const { randomBytes } = require('crypto');
   *
   * const pkSecret = Wots.generate();
   * const message = randomBytes(TRANLEN);
   * const signature = Wots.sign(message, pkSecret.secret);
   * console.log('WOTS+ Signature: ' + Buffer.from(signature).toString('hex'));
   */
  static sign (message, secret) {
    const fid = LOG.debug('Wots.sign()');
    // check and sanitize input parameters
    LOG.debug(fid, 'check parameters...');
    message = sanitizeUint8Array(fid, { message });
    secret = sanitizeUint8Array(fid, { secret });
    // define Uint8Arrays: pk, public seed (pk.buffer) and addr
    const pk = new Uint8Array(TXADDRLEN);
    const pubSeed = new Uint8Array(pk.buffer, Wots.PUBSEEDp, 32);
    const addr = new Uint8Array(32);
    // define Uint32Arrays: lengths32 and addr32 (addr.buffer)
    const lengths32 = new Uint32Array(WOTSLEN);
    const addr32 = new Uint32Array(addr.buffer);
    // create sha256 hash of message for signing
    LOG.debug(fid, 'hash message...');
    const hash = createHash('sha256').update(message).digest();
    // derive matching chain lengths from hashed message
    chainLengths(lengths32, hash);
    // expand seed public key/seed/addr (w/ secret)
    LOG.debug(fid, 'expand seed (w/ secret) to pk...');
    rndBytes(pk, TXADDRLEN, secret);
    // copy addr segment from pk
    addr.set(pk.subarray(Wots.ADDRp, Wots.ADDRp + 32));
    // expand secret to WOTS+ private key, processed in pk
    LOG.debug(fid, 'expand secret to WOTS+ private key...');
    expandSecret(pk, secret);
    // generate WOTS+ public key from private key
    LOG.debug(fid, 'generate WOTS+ signature...');
    for (let i = 0; i < WOTSLEN; i++) {
      const sigpart = new Uint8Array(pk.buffer, i * PARAMSN, PARAMSN);
      addr32[5] = i; // SetChainAddr(addr32, i); // carried from wotshash.c
      generateChain(sigpart, sigpart, 0, lengths32[i], pubSeed, addr32);
    } // cleanup
    cleanupGlobals();
    // return WOTS+ signature
    return Uint8Array.from(pk.subarray(0, Sigbytes));
  }

  /**
   * Verify a WOTS+ signature against a known message and WOTS+ address.
   * @param {external:Uint8Array} signature The WOTS+ signature
   * @param {external:Uint8Array} message The message used to sign
   * @param {external:Uint8Array} address The WOTS+ address to verify against
   * the signature
   * @return {external:Boolean} Verification result
   * @throws {TypeError} when __signature__ is not 2144 bytes long
   * @throws {TypeError} when __address__ is not 2208 bytes long
   * @example
   * const { Wots, TXSIGLEN, TRANLEN, TXADDRLEN } = require('mochimo');
   *
   * const signature = Buffer.alloc(TXSIGLEN); // 2144 byte array
   * const message = Buffer.alloc(TRANLEN); // 8792 byte array
   * const address = Buffer.alloc(TXADDRLEN); // 2208 byte array
   * console.log('WOTS+ signature verification',
   *   Wots.verify(signature, message, address) ? 'valid' : 'not valid'); */
  static verify (signature, message, address) {
    const fid = 'Wots.verify()';
    // check and sanitize input arrays
    signature = sanitizeUint8Array(fid, { signature }, Sigbytes, Sigbytes);
    message = sanitizeUint8Array(fid, { message });
    address = sanitizeUint8Array(fid, { address }, TXADDRLEN, TXADDRLEN);
    // define subarrays: public seed and addr (segments of address)
    const pubSeed = address.subarray(Wots.PUBSEEDp, Wots.PUBSEEDp + 32);
    const addr = address.subarray(Wots.ADDRp, Wots.ADDRp + 32);
    // generate WOTS+ public key from signature
    const pkFromSig = Wots.pkFromSig(signature, message, pubSeed, addr);
    // check if pkFromSig is different from pk "some"-where
    const isDiff = pkFromSig.some((curr, i) => curr !== address[i]);
    // invert isDiff to get verification status
    return Boolean(!isDiff);
  }

  /**
   * @type {external:Number}
   * @constant_value `2176`
   * @desc Pointer to the ADDR portion of a WOTS+ address */
  static get ADDRp () {
    return WOTSSIGBYTES + PARAMSN;
  }

  /**
   * @type {external:Number}
   * @constant_value `2144`
   * @desc Pointer to the Public Seed portion of a WOTS+ address */
  static get PUBSEEDp () {
    return WOTSSIGBYTES;
  }

  /**
   * @type {external:Number}
   * @constant_value `2144`
   * @desc The byte length of a WOTS+ Signature */
  static get SIGLEN () {
    return WOTSSIGBYTES;
  }
}

module.exports = Wots;
