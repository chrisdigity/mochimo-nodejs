
/* requirements */
const { array2string } = require('./util');
const {
  HASHLEN,
  TXADDRLEN,
  TXSIGLEN,
  UNTAGGED_BYTES,
  DEFAULT_TAG
} = require('./constants');
const Trigg = require('./trigg');

/**
 * @typicalname lentry
 * @augments {external:Uint8Array}
 * @classdesc *LEntry class objects are only accessible via the {@link Block}
 * class.*<br>The Ledger Entry class is a Uint8Array of static size containing
 * a full WOTS+ address and a 64-bit balance. */
class LEntry extends Uint8Array {
  constructor (...args) {
    // force LEntry.length (2216) array length
    super(args[0], args[1], LEntry.length);
  }

  /**
   * @type {external:String}
   * @desc The full 2208 byte Mochimo address, in hexadecimal format */
  get address () {
    return array2string(this.subarray(0, TXADDRLEN));
  }

  /**
   * @type {external:BigInt}
   * @desc The associated balance, in nanoMochimo */
  get balance () {
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + TXADDRLEN, true);
  }

  /**
   * @type {external:String}
   * @desc The tag attached to the ledger address, in hexadecimal format */
  get tag () {
    const tag = array2string(this.subarray(2196, TXADDRLEN));
    return tag === DEFAULT_TAG ? null : tag;
  }

  /**
   * @prop {external:String} address *refer to LEntry class properties*
   * @prop {external:String} balance
   * @prop {external:String} tag
   * @return {external:Object} LEntry class object, in JSON format */
  toJSON () {
    return {
      addr: this.addr,
      balance: this.balance,
      tag: this.tag
    };
  }

  /**
   * @type {external:Number}
   * @constant_value `2216`
   * @desc Breakdown:
   * - WOTS+ address, 2208 bytes
   * - Balance (64bit), 8 bytes */
  static get length () {
    return 2216;
  }

  // Overwrite LEntry species with Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
} // end class LEntry...

/**
 * @typicalname txreference
 * @augments {external:Uint8Array}
 * @classdesc *TXReference class objects are only accessible via the
 * {@link Block} class.*<br>The Transaction Reference class is a heavily
 * minified transaction type object, represented as a Uint8Array and designed
 * with transaction history in mind. The transaction signature, transaction ID,
 * and any block identifiers are purposely omitted, with the intention of use in
 * a key, filename, or database, depending on application requirements.
 * Additionally, addresses get truncated to either an associated tag, the first
 * 32 bytes of a WOTS+ address, or, in the case of an extended TX transaction,
 * the whole 2208 bytes of a destination address. */
class TXReference extends Uint8Array {
  /**
   * @type {external:BigInt}
   * @desc The transaction send amount, in nanoMochimo */
  get sendtotal () {
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + TXReference.SENDTOTALp, true);
  }

  /**
   * @type {external:BigInt}
   * @desc The transaction change amount, in nanoMochimo */
  get changetotal () {
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + TXReference.CHANGETOTALp, true);
  }

  /**
   * @type {external:BigInt}
   * @desc The transaction fee, in nanoMochimo */
  get txfee () {
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + TXReference.TXFEEp, true);
  }

  /**
   * @type {external:String}
   * @desc The source address, in hexadecimal format */
  get srcaddr () {
    // determine source address length
    const type = this[TXReference.SRCTYPEp];
    const length = type === 0xff ? 12 : type > 0 ? TXADDRLEN : 32;
    // return address as String
    return array2string(this.subarray(
      TXReference.ADDRp, TXReference.ADDRp + length));
  }

  /**
   * @type {external:String}
   * @desc The destination address, in hexadecimal format */
  get dstaddr () {
    // determine destination address pointer
    const srcType = this[TXReference.SRCTYPEp];
    const srcLength = srcType === 0xff ? 12 : srcType > 0 ? TXADDRLEN : 32;
    const DSTADDRp = TXReference.ADDRp + srcLength;
    // determine destination address length
    const type = this[TXReference.DSTTYPEp];
    const length = type === 0xff ? 12 : type > 0 ? TXADDRLEN : 32;
    // return address as String
    return array2string(this.subarray(DSTADDRp, DSTADDRp + length));
  }

  /**
   * @type {external:String}
   * @desc The change address, in hexadecimal format */
  get chgaddr () {
    // determine change address pointer
    const srcType = this[TXReference.SRCTYPEp];
    const srcLength = srcType === 0xff ? 12 : srcType > 0 ? TXADDRLEN : 32;
    const dstType = this[TXReference.DSTTYPEp];
    const dstLength = dstType === 0xff ? 12 : dstType > 0 ? TXADDRLEN : 32;
    const CHGADDRp = TXReference.ADDRp + srcLength + dstLength;
    // determine change address length
    const type = this[TXReference.CHGTYPEp];
    const length = type === 0xff ? 12 : type > 0 ? TXADDRLEN : 32;
    // return address as String
    return array2string(this.subarray(CHGADDRp, CHGADDRp + length));
  }

  /**
   * @prop {external:BigInt} sendtotal *refer to TXReference class properties*
   * @prop {external:BigInt} changetotal
   * @prop {external:BigInt} txfee
   * @prop {external:String} dstaddr
   * @prop {external:String} chgaddr
   * @return {external:Object} TXReference class object, in JSON format */
  toJSON () {
    return {
      sendtotal: this.sendtotal,
      changetotal: this.changetotal,
      txfee: this.txfee,
      dstaddr: this.dstaddr,
      chgaddr: this.chgaddr
    };
  }

  /**
   * @return {external:Number}
   * @constant_value `0`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `sendtotal` */
  static get SENDTOTALp () {
    return 0;
  }

  /**
   * @return {external:Number}
   * @constant_value `8`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `changetotal` */
  static get CHANGETOTALp () {
    return 8;
  }

  /**
   * @return {external:Number}
   * @constant_value `16`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `txfee` */
  static get TXFEEp () {
    return 16;
  }

  /**
   * @return {external:Number}
   * @constant_value `24`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to src address type */
  static get SRCTYPEp () {
    return 24;
  }

  /**
   * @return {external:Number}
   * @constant_value `25`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to dst address type */
  static get DSTTYPEp () {
    return 25;
  }

  /**
   * @return {external:Number}
   * @constant_value `26`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to chg address type */
  static get CHGTYPEp () {
    return 26;
  }

  /**
   * @return {external:Number}
   * @constant_value `26`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to address */
  static get ADDRp () {
    return 27;
  }

  // Overwrite TXReference species with Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
} // end class TXReference...

/**
 * @typicalname txentry
 * @augments {external:Uint8Array}
 * @classdesc *TXEntry class objects are only accessible via the {@link Block}
 * class.*<br>The Transaction class is a Uint8Array of static size containing
 * all elements required for inclusion in a valid Mochimo Block or TX Object.
 * TXEntry is typically used for reading transactions from a Mochimo Block. */
class TXEntry extends Uint8Array {
  constructor (...args) {
    // force TXEntry.length (8824) array length
    super(args[0], args[1], TXEntry.length);
  }

  /**
   * @type {external:String}
   * @desc The source address, in hexadecimal format */
  get srcaddr () {
    return array2string(
      this.subarray(TXEntry.SRCADDRp, TXEntry.SRCADDRp + TXADDRLEN));
  }

  /**
   * @type {external:String}
   * @desc The tag attached to the source address, in
   * hexadecimal format */
  get srctag () {
    const tag = array2string(
      this.subarray(TXEntry.SRCADDRp + 2196, TXEntry.SRCADDRp + TXADDRLEN));
    return tag === DEFAULT_TAG ? null : tag;
  }

  /**
   * @type {external:String}
   * @desc The destination address, in hexadecimal format */
  get dstaddr () {
    return array2string(
      this.subarray(TXEntry.DSTADDRp, TXEntry.DSTADDRp + TXADDRLEN));
  }

  /**
   * @type {external:String}
   * @desc The tag attached to the destination address, in
   * hexadecimal format */
  get dsttag () {
    const tag = array2string(
      this.subarray(TXEntry.DSTADDRp + 2196, TXEntry.DSTADDRp + TXADDRLEN));
    return tag === DEFAULT_TAG ? null : tag;
  }

  /**
   * @type {external:String}
   * @desc The change address, in hexadecimal format */
  get chgaddr () {
    return array2string(
      this.subarray(TXEntry.CHGADDRp, TXEntry.CHGADDRp + TXADDRLEN));
  }

  /**
   * @type {external:String}
   * @desc The tag attached to the change address, in
   * hexadecimal format */
  get chgtag () {
    const tag = array2string(
      this.subarray(TXEntry.CHGADDRp + 2196, TXEntry.CHGADDRp + TXADDRLEN));
    return tag === DEFAULT_TAG ? null : tag;
  }

  /**
   * @type {external:BigInt}
   * @desc The transaction send amount, in nanoMochimo */
  get sendtotal () {
    return new DataView(this.buffer)
      .getBigUint64(this.byteOffset + TXEntry.SENDTOTALp, true);
  }

  /**
   * @type {external:BigInt}
   * @desc The transaction change amount, in nanoMochimo */
  get changetotal () {
    return new DataView(this.buffer)
      .getBigUint64(this.byteOffset + TXEntry.CHANGETOTALp, true);
  }

  /**
   * @type {external:BigInt}
   * @desc The transaction fee, in nanoMochimo */
  get txfee () {
    return new DataView(this.buffer)
      .getBigUint64(this.byteOffset + TXEntry.TXFEEp, true);
  }

  /**
   * @type {external:String}
   * @desc The transaction signature, in hexadecimal format
   */
  get txsig () {
    return array2string(
      this.subarray(TXEntry.TXSIGp, TXEntry.TXSIGp + TXSIGLEN));
  }

  /**
   * @type {external:String}
   * @desc The transaction id, in hexadecimal format */
  get txid () {
    return array2string(this.subarray(TXEntry.TXIDp, TXEntry.TXIDp + HASHLEN));
  }

  /**
   * @prop {external:String} srcaddr *refer to TXEntry class properties*
   * @prop {external:String} dstaddr
   * @prop {external:String} chgaddr
   * @prop {external:BigInt} sendtotal
   * @prop {external:BigInt} changetotal
   * @prop {external:BigInt} txfee
   * @prop {external:String} txsig
   * @prop {external:String} txid
   * @return {external:Object} TXEntry class object, in JSON format */
  toJSON () {
    return {
      srcaddr: this.srcaddr,
      dstaddr: this.dstaddr,
      chgaddr: this.chgaddr,
      sendtotal: this.sendtotal,
      changetotal: this.changetotal,
      txfee: this.txfee,
      txsig: this.txsig,
      txid: this.txid
    };
  }

  /**
   * @return {external:TXReference} A heavily minified version of the
   * transaction entry object */
  toReference () {
    // determine address types - 0xff indicates a tagged address
    const srcType = UNTAGGED_BYTES.includes(this[TXEntry.SRCADDRp + 2196])
      ? this[TXEntry.SRCADDRp + 2197] : 0xff;
    const dstType = UNTAGGED_BYTES.includes(this[TXEntry.DSTADDRp + 2196])
      ? this[TXEntry.DSTADDRp + 2197] : 0xff;
    const chgType = UNTAGGED_BYTES.includes(this[TXEntry.CHGADDRp + 2196])
      ? this[TXEntry.CHGADDRp + 2197] : 0xff;
    // calculate extra length for addresses
    const srcaddrLength = srcType === 0xff ? 12 : srcType > 0 ? TXADDRLEN : 32;
    const srcaddrPointer = TXEntry.SRCADDRp + (srcType === 0xff ? 2196 : 0);
    const dstaddrLength = dstType === 0xff ? 12 : dstType > 0 ? TXADDRLEN : 32;
    const dstaddrPointer = TXEntry.DSTADDRp + (dstType === 0xff ? 2196 : 0);
    const chgaddrLength = chgType === 0xff ? 12 : chgType > 0 ? TXADDRLEN : 32;
    const chgaddrPointer = TXEntry.CHGADDRp + (chgType === 0xff ? 2196 : 0);
    const addrLengths = srcaddrLength + dstaddrLength + chgaddrLength;
    // create TXReference of suitable length
    const len = addrLengths + TXReference.ADDRp; /*
    const len = 3*( 2208 or 12 ) + amounts + fee + 3*addrTypes */
    const ref = new TXReference(len);
    // minify data
    ref.set(this.subarray(TXEntry.SENDTOTALp, TXEntry.SENDTOTALp + 8),
      TXReference.SENDTOTALp);
    ref.set(this.subarray(TXEntry.CHANGETOTALp, TXEntry.CHANGETOTALp + 8),
      TXReference.CHANGETOTALp);
    ref.set(this.subarray(TXEntry.TXFEEp, TXEntry.TXFEEp + 8),
      TXReference.TXFEEp);
    ref[TXReference.SRCTYPEp] = srcType;
    ref[TXReference.DSTTYPEp] = dstType;
    ref[TXReference.CHGTYPEp] = chgType;
    ref.set(this.subarray(srcaddrPointer, srcaddrPointer + srcaddrLength),
      TXReference.ADDRp);
    ref.set(this.subarray(dstaddrPointer, dstaddrPointer + dstaddrLength),
      TXReference.ADDRp + srcaddrLength);
    ref.set(this.subarray(chgaddrPointer, chgaddrPointer + chgaddrLength),
      TXReference.ADDRp + srcaddrLength + dstaddrLength);
    // return completed TXReference
    return ref;
  }

  /**
   * @type {external:Number}
   * @constant_value `0`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `srcaddr` */
  static get SRCADDRp () {
    return 0;
  }

  /**
   * @type {external:Number}
   * @constant_value `2208`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `dstaddr` */
  static get DSTADDRp () {
    return 2208;
  }

  /**
   * @type {external:Number}
   * @constant_value `4416`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `chgaddr` */
  static get CHGADDRp () {
    return 4416;
  }

  /**
   * @type {external:Number}
   * @constant_value `6624`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `sendtotal` */
  static get SENDTOTALp () {
    return 6624;
  }

  /**
   * @type {external:Number}
   * @constant_value `6632`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `changetotal` */
  static get CHANGETOTALp () {
    return 6632;
  }

  /**
   * @type {external:Number}
   * @constant_value `6640`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `txfee` */
  static get TXFEEp () {
    return 6640;
  }

  /**
   * @type {external:Number}
   * @constant_value `6648`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `txsig` */
  static get TXSIGp () {
    return 6648;
  }

  /**
   * @type {external:Number}
   * @constant_value `8792`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `txid` */
  static get TXIDp () {
    return 8792;
  }

  /**
   * @type {external:Number}
   * @constant_value `8824`
   * @desc Breakdown:
   * - 3x WOTS+ (inc. tag), 6624 bytes
   * - 3x Amounts (64bit), 24 bytes
   * - 1x Signature (WOTS+), 2144 bytes
   * - 1x ID Hash (sha256), 32 bytes */
  static get length () {
    return 8824;
  }

  // Overwrite TXEntry species to the parent Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
} // end class TXEntry...

/**
 * @typicalname blocktrailer
 * @augments {external:Uint8Array}
 * @classdesc The BlockTrailer class is a Uint8Array of static size containing
 * the trailer elements appended to a valid Mochimo Block. BlockTrailers can be
 * joined together in series to create a historically verifiable chain known as
 * a {@link Tfile}. */
class BlockTrailer extends Uint8Array {
  constructor (...args) {
    // force BlockTrailer.length (160) array length
    super(args[0], args[1], BlockTrailer.length);
  }

  /**
   * @type {external:String}
   * @desc The previous block hash, in hexadecimal format */
  get phash () {
    return BlockTrailer.phash(this);
  }

  /**
   * @type {external:BigInt}
   * @desc The block number */
  get bnum () {
    return BlockTrailer.bnum(this);
  }

  /**
   * @type {external:BigInt}
   * @desc The mining fee (a.k.a. transaction fee), in
   * nanoMochimo */
  get mfee () {
    return BlockTrailer.mfee(this);
  }

  /**
   * @type {external:Number}
   * @desc The number of transactions */
  get tcount () {
    return BlockTrailer.tcount(this);
  }

  /**
   * @type {external:Number}
   * @desc The previous block's solve time (UTC seconds) */
  get time0 () {
    return BlockTrailer.time0(this);
  }

  /**
   * @type {external:Number}
   * @desc The mining difficulty */
  get difficulty () {
    return BlockTrailer.difficulty(this);
  }

  /**
   * @type {external:String}
   * @desc The merkle root, in hexadecimal format */
  get mroot () {
    return BlockTrailer.mroot(this);
  }

  /**
   * @type {external:String}
   * @desc The nonce, in hexadecimal format */
  get nonce () {
    return BlockTrailer.nonce(this);
  }

  /**
   * @type {external:String}
   * @desc The current block's solve time (UTC seconds) */
  get stime () {
    return BlockTrailer.stime(this);
  }

  /**
   * @type {external:String}
   * @desc The current block hash, in hexadecimal format */
  get bhash () {
    return BlockTrailer.bhash(this);
  }

  /**
   * @prop {external:String} phash *refer to BlockTrailer class properties*
   * @prop {external:BigInt} bnum
   * @prop {external:BigInt} mfee
   * @prop {external:Number} tcount
   * @prop {external:Number} time0
   * @prop {external:Number} difficulty
   * @prop {external:String} mroot
   * @prop {external:String} nonce
   * @prop {external:String} stime
   * @prop {external:String} bhash
   * @return {external:Object} BlockTrailer class object, in JSON format */
  toJSON () {
    return {
      phash: this.phash,
      bnum: this.bnum,
      mfee: this.mfee,
      tcount: this.tcount,
      time0: this.time0,
      difficulty: this.difficulty,
      mroot: this.mroot,
      nonce: this.nonce,
      stime: this.stime,
      bhash: this.bhash
    };
  }

  /**
   * @type {external:Number}
   * @constant_value `0`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `phash` */
  static get PHASHp () {
    return 0;
  }

  /**
   * @type {external:Number}
   * @constant_value `32`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `bnum` */
  static get BNUMp () {
    return 32;
  }

  /**
   * @type {external:Number}
   * @constant_value `40`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `mfee` */
  static get MFEEp () {
    return 40;
  }

  /**
   * @type {external:Number}
   * @constant_value `48`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `tcount` */
  static get TCOUNTp () {
    return 48;
  }

  /**
   * @type {external:Number}
   * @constant_value `52`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `time0` */
  static get TIME0p () {
    return 52;
  }

  /**
   * @type {external:Number}
   * @constant_value `56`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `diff` */
  static get DIFFp () {
    return 56;
  }

  /**
   * @type {external:Number}
   * @constant_value `60`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `mroot` */
  static get MROOTp () {
    return 60;
  }

  /**
   * @type {external:Number}
   * @constant_value `92`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `nonce` */
  static get NONCEp () {
    return 92;
  }

  /**
   * @type {external:Number}
   * @constant_value `124`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `stime` */
  static get STIMEp () {
    return 124;
  }

  /**
   * @type {external:Number}
   * @constant_value `128`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `bhash` */
  static get BHASHp () {
    return 128;
  }

  /**
   * @type {external:Number}
   * @constant_value `160`
   * @desc Breakdown:
   * - 4x Hash (sha256), 128 bytes
   * - 2x Number (64-bit), 16 bytes
   * - 4x Number (32-bit), 16 bytes */
  static get length () {
    return 160;
  }

  // static function shared by both BlockTrailer and Block classes
  static phash (array) {
    const bounds = BlockTrailer.PHASHp + HASHLEN;
    // intercept access beyond array length
    if (array.byteLength < bounds) return null;
    // return previous hash as hexdecimal String
    return array2string(array.subarray(BlockTrailer.PHASHp, bounds));
  }

  // static function shared by both BlockTrailer and Block classes
  static bnum (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.BNUMp + 8) {
      return null;
    }
    // return block number as 64 bit unsigned integer
    return new DataView(array.buffer).getBigUint64(
      array.byteOffset + BlockTrailer.BNUMp, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static mfee (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.MFEEp + 8) {
      return null;
    }
    // return mining fee as 64 bit unsigned integer
    return new DataView(array.buffer).getBigUint64(
      array.byteOffset + BlockTrailer.MFEEp, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static tcount (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.TCOUNTp + 4) {
      return null;
    }
    // return transaction count as 32 bit unsigned integer
    return new DataView(array.buffer).getUint32(
      array.byteOffset + BlockTrailer.TCOUNTp, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static time0 (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.TIME0p + 4) {
      return null;
    }
    // return block time as 32 bit unsigned integer
    return new DataView(array.buffer).getUint32(
      array.byteOffset + BlockTrailer.TIME0p, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static difficulty (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.DIFFp + 4) {
      return null;
    }
    // return difficulty as 32 bit unsigned integer
    return new DataView(array.buffer).getUint32(
      array.byteOffset + BlockTrailer.DIFFp, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static mroot (array) {
    const bounds = BlockTrailer.MROOTp + HASHLEN;
    // intercept access beyond array length
    if (array.byteLength < bounds) return null;
    // return merkle root as hexdecimal String
    return array2string(array.subarray(BlockTrailer.MROOTp, bounds));
  }

  // static function shared by both BlockTrailer and Block classes
  static nonce (array) {
    const bounds = BlockTrailer.NONCEp + HASHLEN;
    // intercept access beyond array length
    if (array.byteLength < bounds) return null;
    // return nonce as hexdecimal String
    return array2string(array.subarray(BlockTrailer.NONCEp, bounds));
  }

  // static function shared by both BlockTrailer and Block classes
  static stime (array) {
    // intercept access beyond buffer length
    if (array.buffer.byteLength < array.byteOffset + BlockTrailer.STIMEp + 4) {
      return null;
    }
    // return solve time as 32 bit unsigned integer
    return new DataView(array.buffer).getUint32(
      array.byteOffset + BlockTrailer.STIMEp, true);
  }

  // static function shared by both BlockTrailer and Block classes
  static bhash (array) {
    const bounds = BlockTrailer.BHASHp + HASHLEN;
    // intercept access beyond array length
    if (array.byteLength < bounds) return null;
    // return block hash as hexdecimal String
    return array2string(array.subarray(BlockTrailer.BHASHp, bounds));
  }

  // Overwrite BlockTrailer species to the parent Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
} // end class BlockTrailer...

/**
 * @typicalname block
 * @augments {external:Uint8Array}
 * @classdesc The Block class is a Uint8Array consisting of 3 main parts; a
 * block header, block contents, and a block trailer. The contents of a block
 * can be either transactions (for a normal block), ledger entries (for a
 * neogenesis block), or empty (for a pseudo block). */
class Block extends Uint8Array {
  /**
   * @type {external:Number}
   * @desc The block type
   * @see {@link Block.INVALID}
   * @see {@link Block.NORMAL}
   * @see {@link Block.GENESIS}
   * @see {@link Block.NEOGENESIS}
   * @see {@link Block.PSEUDO} */
  get type () {
    // determine block type using hdrlen and block number
    const bnum = this.bnum;
    const hdrlen = this.hdrlen;
    if (hdrlen === null || bnum === null) return Block.INVALID;
    if (hdrlen === 4) return Block.PSEUDO;
    if (bnum & 0xffn) return Block.NORMAL;
    if (bnum === 0n) return Block.GENESIS;
    return Block.NEOGENESIS;
  }

  /**
   * @type {external:Number}
   * @desc The block header length
   * @null if...
   * - size of block buffer is < 4 bytes */
  get hdrlen () {
    // intercept access beyond buffer length
    if (this.buffer.byteLength < this.byteOffset + 4) return null;
    // return 32 bit unsigned integer as hdrlen
    return new DataView(this.buffer).getUint32(this.byteOffset, true);
  }

  /**
   * @type {external:String}
   * @desc The address that receives the mining reward, in hexadecimal format
   * @null if...
   * - size of block buffer is < 2212 bytes
   * - `hdrlen` < 2212 bytes */
  get maddr () {
    const bounds = 4 + TXADDRLEN;
    // intercept access beyond array length
    if (this.byteLength < bounds) return null;
    // intercept access beyond hdrlen
    if (this.hdrlen < bounds) return null;
    // return mining address as Hexdecimal String
    return array2string(this.subarray(4, bounds));
  }

  /**
   * @type {external:BigInt}
   * @desc The mining reward, in nanoMochimo
   * @null if...
   * - size of block buffer is < 2220 bytes
   * - `hdrlen` < 2220 bytes */
  get mreward () {
    // intercept access beyond buffer length
    if (this.buffer.byteLength < this.byteOffset + 2220) return null;
    // intercept access beyond hdrlen
    if (this.hdrlen < 2220) return null;
    // return 32 byte mining address as Hexdecimal String
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + 2212, true);
  }

  /**
   * @type {Array.<external:TXEntry>}
   * @desc An array of transaction entries contained within the block
   * @default [] */
  get transactions () {
    const transactions = [];
    // no transactions in (neo)genesis blocks
    if (this.type !== Block.NORMAL) return transactions;
    // begin building block transaction list
    const len = this.hdrlen + (this.tcount * TXEntry.length);
    for (let offset = this.hdrlen; offset < len; offset += TXEntry.length) {
      transactions.push(new TXEntry(this.buffer, offset));
    }
    return transactions;
  }

  /**
   * @type {Array.<external:LEntry>}
   * @desc An array of ledger entries contained within the block
   * @default [] */
  get ledger () {
    const ledger = [];
    // no ledger data in non-neogenesis blocks
    if (this.type !== Block.NEOGENESIS) return ledger;
    // begin building block transaction list
    const len = this.hdrlen;
    for (let offset = 4; offset < len; offset += LEntry.length) {
      ledger.push(new LEntry(this.buffer, offset));
    }
    return ledger;
  }

  /**
   * @type {external:BlockTrailer}
   * @desc A BlockTrailer object associated with the block */
  get trailer () {
    return new BlockTrailer(this.slice(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:String}
   * @see {@link BlockTrailer.phash} */
  get phash () {
    // return previous hash from static BlockTrailer function
    return BlockTrailer.phash(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:BigInt}
   * @see {@link BlockTrailer.bnum} */
  get bnum () {
    // return block number from static BlockTrailer function
    return BlockTrailer.bnum(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:BigInt}
   * @see {@link BlockTrailer.mfee} */
  get mfee () {
    // return mining fee from static BlockTrailer function
    return BlockTrailer.mfee(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:Number}
   * @see {@link BlockTrailer.tcount} */
  get tcount () {
    // return transaction count from static BlockTrailer function
    return BlockTrailer.tcount(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:Number}
   * @see {@link BlockTrailer.time0} */
  get time0 () {
    // return block time from static BlockTrailer function
    return BlockTrailer.time0(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:Number}
   * @see {@link BlockTrailer.difficulty} */
  get difficulty () {
    // return difficulty from static BlockTrailer function
    return BlockTrailer.difficulty(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:String}
   * @see {@link BlockTrailer.mroot} */
  get mroot () {
    // return merkle root from static BlockTrailer function
    return BlockTrailer.mroot(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:String}
   * @see {@link BlockTrailer.nonce} */
  get nonce () {
    // return nonce from static BlockTrailer function
    return BlockTrailer.nonce(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:Number}
   * @see {@link BlockTrailer.stime} */
  get stime () {
    // return solve time from static BlockTrailer function
    return BlockTrailer.stime(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @type {external:String}
   * @see {@link BlockTrailer.bhash} */
  get bhash () {
    // return block hash from static BlockTrailer function
    return BlockTrailer.bhash(
      this.subarray(this.byteLength - BlockTrailer.length));
  }

  /**
   * @prop {external:String} bhash *refer to Block class properties*
   * @prop {external:String} phash
   * @prop {external:String} mroot
   * @prop {external:String} nonce
   * @prop {external:String} maddr
   * @prop {external:BigInt} mreward
   * @prop {external:BigInt} mfee
   * @prop {external:Number} tcount
   * @prop {external:Number} difficulty
   * @prop {external:Number} time0
   * @prop {external:String} stime
   * @prop {external:BigInt} bnum
   * @prop {external:String} type Human readable block type
   * @prop {external:String} haiku Haiku expanded from nonce
   * @prop {Array.<external:TXEntry>} transactions Transactions present in block
   * @prop {Array.<external:LEntry>} ledger Ledger entries present in block
   * @return {external:Object} Block class object, in JSON format */
  toJSON () {
    const isNormal = Boolean(this.type === Block.NORMAL);
    const isNeogenesis = Boolean(this.type === Block.NEOGENESIS);
    const json = this.toSummary();
    // add transaction data for 'normal' Block types
    if (isNormal) {
      json.transactions = [];
      const transactions = this.transactions;
      for (let i = 0; i < transactions.length; i++) {
        json.transactions.push(transactions[i].getDetails());
      }
    }
    // add ledger data for 'neogenesis' blocks
    if (isNeogenesis) {
      json.ledger = [];
      const ledger = this.ledger;
      for (let i = 0; i < ledger.length; i++) {
        json.ledger.push(ledger[i].toJSON());
      }
    }
    // return completed json block
    return json;
  }

  /**
   * @prop {external:String} bhash *refer to Block class properties*
   * @prop {external:String} phash
   * @prop {external:String} mroot
   * @prop {external:String} nonce
   * @prop {external:String} maddr
   * @prop {external:BigInt} mreward
   * @prop {external:BigInt} mfee
   * @prop {external:Number} tcount
   * @prop {external:Number} difficulty
   * @prop {external:Number} time0
   * @prop {external:String} stime
   * @prop {external:BigInt} bnum
   * @prop {external:String} type Human readable block type
   * @prop {external:String} haiku Haiku expanded from nonce
   * @return {external:Object} Block class object, in JSON format (excluding
   * transactions and ledger entries) */
  toSummary () {
    const isNormal = Boolean(this.type === Block.NORMAL);
    const isMined = Boolean(isNormal || this.type === Block.GENESIS); // premine
    const json = {};
    // add hash data
    json.bhash = this.bhash;
    json.phash = this.phash;
    json.mroot = this.mroot;
    json.nonce = this.nonce;
    // add mining data
    json.maddr = isMined ? this.maddr : null;
    json.mreward = isMined ? this.mreward : null;
    // add all trailer data
    json.mfee = this.mfee;
    json.tcount = this.tcount;
    json.difficulty = this.difficulty;
    json.time0 = this.time0;
    json.stime = this.stime;
    json.bnum = this.bnum;
    // add block type
    json.type = this.type;
    // expand haiku from nonce
    json.haiku = isNormal ? Trigg.expand(this.nonce) : null;
    // return summarized json block
    return json;
  }

  /**
   * @type {external:Number}
   * @constant_value `-1`
   * @desc Represents an invalid block type */
  static get INVALID () {
    return -1;
  }

  /**
   * @type {external:Number}
   * @constant_value `0`
   * @desc Represents a normal block type */
  static get NORMAL () {
    return 0;
  }

  /**
   * @type {external:Number}
   * @constant_value `1`
   * @desc Represents a genesis block type */
  static get GENESIS () {
    return 1;
  }

  /**
   * @type {external:Number}
   * @constant_value `2`
   * @desc Represents a neogenesis block type */
  static get NEOGENESIS () {
    return 2;
  }

  /**
   * @type {external:Number}
   * @constant_value `3`
   * @desc Represents a pseudo block type */
  static get PSEUDO () {
    return 3;
  }

  // Overwrite Block species to the parent Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
}

/**
 * @typicalname tfile
 * @augments {external:Uint8Array}
 * @classdesc The Tfile class is a Uint8Array desgined to contain all or part of
 * the historically verifiable chain known as a Tfile in the Mochimo ecosystem.
 */
class Tfile extends Uint8Array {
  /**
   * *FOR ADVANCED USE ONLY!*<br>Although the Tfile class *can* be instantiated
   * directly, it is **not recommended.**<br>Instead, consider using
   * {@link #module_Mochimo..getTfile|Mochimo.getTfile()} to obtain a Tfile
   * directly from the Mochimo network.
   * @param {(external:ArrayBuffer|external:TypedArray)} bytes Tfile data
   * @param {external:Number=} offset The starting byte of the exposed data
   * @param {external:Number=} length The length of the exposed data<br><sup>The
   * length will be modified if not a multiple of BlockTrailer.length (160) */
  constructor (bytes, offset, length) {
    // force previous multiple of BlockTrailer.length (160) as array length
    const byteDiff = length % BlockTrailer.length;
    if (byteDiff) length -= byteDiff;
    super(bytes, offset, length);
  }

  /**
   * @param {external:Number} index Index of desired block trailer
   * @return {external:BlockTrailer} A BlockTrailer object representing trailer
   * data at the specified index. */
  trailer (index) {
    return new BlockTrailer(this.buffer, index * BlockTrailer.length);
  }

  // Overwrite BlockTrailer species to the parent Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
}

module.exports = { Tfile, Block, BlockTrailer, TXReference };
