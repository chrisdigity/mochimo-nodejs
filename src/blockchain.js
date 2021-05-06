
/* global BigInt */

/* requirements */
const {
  HASHLEN,
  TAGLEN,
  TXADDRLEN,
  TXSIGLEN
} = require('./constants');
const { array2string, sanitizeUint8Array } = require('./util');
const Trigg = require('./trigg');
const { createHash } = require('crypto');

/**
 * @typicalname lentry
 * @augments {external:Uint8Array}
 * @classdesc *LEntry class objects are only accessible via the {@link Block}
 * class.*<br>The Ledger Entry class is a Uint8Array of static size containing
 * a full WOTS+ address and a 64-bit balance. */
class LEntry extends Uint8Array {
  constructor (...args) {
    // defaults
    args[0] = args[0] || new ArrayBuffer(LEntry.length);
    args[1] = args[1] || 0;
    // force LEntry.length (2216) array length
    super(args[0], args[1], LEntry.length);
  }

  /**
   * The full 2208 byte Mochimo address, in hexadecimal format
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 4416 hexadecimal character String or 2208 byte Array.
   * @type {external:String}
   * @default "0000... <4416 characters>" */
  get address () {
    return array2string(this.subarray(LEntry.ADDRESSp, TXADDRLEN));
  }

  set address (address) {
    this.set(sanitizeUint8Array('LEntry.address', { address }, TXADDRLEN,
      TXADDRLEN), LEntry.ADDRESSp);
  }

  /**
   * The associated balance, in nanoMochimo
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get balance () {
    return new DataView(this.buffer).getBigUint64(
      this.byteOffset + LEntry.BALANCEp, true);
  }

  set balance (balance) {
    new DataView(this.buffer).setBigUint64(LEntry.BALANCEp, BigInt(balance,
      'LEntry.balance'), true);
  }

  /**
   * The tag attached to the ledger address, in hexadecimal format
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 24 hexadecimal character String or 12 byte Array.
   * @type {external:String}
   * @default "0000... <24 characters>" */
  get tag () {
    return array2string(this.subarray(LEntry.TAGp, TXADDRLEN));
  }

  set tag (tag) {
    this.set(sanitizeUint8Array('LEntry.tag', { tag }, TAGLEN, TAGLEN),
      LEntry.TAGp);
  }

  /**
   * @property {external:Number} address *refer to LEntry class properties*
   * @property {external:Number} balance
   * @property {external:Number} tag
   * @return {external:Object} LEntry class object, in JSON format */
  toJSON (minify) {
    const json = {
      address: this.address,
      balance: this.balance,
      tag: this.tag
    };
    if (minify) json.address = json.address.slice(0, 64);
    return json;
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

  /**
   * @type {external:Number}
   * @constant_value `0`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `address` */
  static get ADDRESSp () {
    return 0;
  }

  /**
   * @type {external:Number}
   * @constant_value `2196`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `tag` */
  static get TAGp () {
    return 2196;
  }

  /**
   * @type {external:Number}
   * @constant_value `2208`
   * @desc *FOR ADVANCED USE ONLY!*<br>Array pointer to `balance` */
  static get BALANCEp () {
    return 2208;
  }

  // Overwrite LEntry species with Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
} // end class LEntry...

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
    return array2string(
      this.subarray(TXEntry.SRCADDRp + 2196, TXEntry.SRCADDRp + TXADDRLEN));
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
    return array2string(
      this.subarray(TXEntry.DSTADDRp + 2196, TXEntry.DSTADDRp + TXADDRLEN));
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
    return array2string(
      this.subarray(TXEntry.CHGADDRp + 2196, TXEntry.CHGADDRp + TXADDRLEN));
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
   * @property {external:Number} srcaddr *refer to TXEntry class properties*
   * @property {external:Number} srctag
   * @property {external:Number} dstaddr
   * @property {external:Number} dsttag
   * @property {external:Number} chgaddr
   * @property {external:Number} chgtag
   * @property {external:Number} sendtotal
   * @property {external:Number} changetotal
   * @property {external:Number} txfee
   * @property {external:Number} txsig
   * @property {external:Number} txid
   * @param {external:Boolean} minify Limits properties to 64 characters long
   * @return {external:Object} TXEntry class object, in JSON format */
  toJSON (minify) {
    const json = {
      txid: this.txid,
      txsig: this.txsig,
      srcaddr: this.srcaddr,
      srctag: this.srctag,
      dstaddr: this.dstaddr,
      dsttag: this.dsttag,
      chgaddr: this.chgaddr,
      chgtag: this.chgtag,
      sendtotal: this.sendtotal,
      changetotal: this.changetotal,
      txfee: this.txfee
    };
    if (minify) {
      json.txsig = json.txsig.slice(0, 64);
      json.srcaddr = json.srcaddr.slice(0, 64);
      json.dstaddr = json.dstaddr.slice(0, 64);
      json.chgaddr = json.chgaddr.slice(0, 64);
    }
    return json;
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
   * @property {external:Number} phash *refer to BlockTrailer class properties*
   * @property {external:Number} bnum
   * @property {external:Number} mfee
   * @property {external:Number} tcount
   * @property {external:Number} time0
   * @property {external:Number} difficulty
   * @property {external:Number} mroot
   * @property {external:Number} nonce
   * @property {external:Number} stime
   * @property {external:Number} bhash
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
   * @type {external:String}
   * @desc The Haiku representation of the blocks nonce.
   * @see {@link Block.nonce} */
  get haiku () {
    return this.type ? null : Trigg.expand(this.nonce);
  }

  /**
   * @type {external:BigInt}
   * @desc Amount of Mochimo sent in transactions for a {@link Block.NORMAL}
   * block type, or amount of Mochimo stored in ledger entries for a
   * {@link Block.NEOGENESIS} block type. */
  get amount () {
    const type = this.type;
    if (type === Block.NORMAL) {
      // count total transaction send amounts using a dataview
      const view = new DataView(this.buffer, this.byteOffset, this.byteLength);
      const tcount = this.tcount;
      let amount = BigInt(0);
      let offset = this.hdrlen + TXEntry.SENDTOTALp;
      for (let i = 0; i < tcount; i++, offset += TXEntry.length) {
        amount += view.getBigUint64(offset, true);
      }
      return amount;
    } else if (type === Block.NEOGENESIS || type === Block.GENESIS) {
      // count total ledger balance amounts using a dataview
      const view = new DataView(this.buffer, this.byteOffset, this.byteLength);
      const hdrlen = this.hdrlen;
      let amount = BigInt(0);
      let offset = 4 + TXADDRLEN;
      for (; offset < hdrlen; offset += LEntry.length) {
        amount += view.getBigUint64(offset, true);
      }
      return amount;
    }
    return null;
  }

  /**
   * @type {external:Number}
   * @desc The block header length
   * @null when size of block buffer is < 4 bytes */
  get hdrlen () {
    // intercept access beyond buffer length
    if (this.buffer.byteLength < this.byteOffset + 4) return null;
    // return 32 bit unsigned integer as hdrlen
    return new DataView(this.buffer).getUint32(this.byteOffset, true);
  }

  /**
   * @type {external:String}
   * @desc The address that receives the mining reward, in hexadecimal format
   * @null when block type !== Block.NORMAL
   * @see {@link Block.NORMAL} */
  get maddr () {
    // check block type is normal
    if (this.type !== Block.NORMAL) return null;
    // return mining address as Hexdecimal String
    return array2string(this.subarray(4, 4 + TXADDRLEN));
  }

  /**
   * @type {external:BigInt}
   * @desc The mining reward, in nanoMochimo
   * @null when block type !== Block.NORMAL
   * @see {@link Block.NORMAL} */
  get mreward () {
    // check block type is normal
    if (this.type !== Block.NORMAL) return null;
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
    let offset = this.hdrlen;
    const len = offset + (this.tcount * TXEntry.length);
    for (; offset < len; offset += TXEntry.length) {
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
    if (this.type !== Block.NEOGENESIS && this.type !== Block.GENESIS) {
      return ledger;
    }
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
   * @property {external:Number} type The block type *as a string*
   * @property {external:Number} size The size of the Block in bytes
   * @property {external:Number} bnum *refer to Block class properties*
   * @property {external:Number} time0
   * @property {external:Number} stime
   * @property {external:Number} difficulty
   * @property {external:Number} bhash
   * @property {external:Number} phash
   * @property {external:Number} mroot *Only available on NORMAL block types*
   * @property {external:Number} nonce *Only available on NORMAL block types*
   * @property {external:Number} maddr *Only available on NORMAL block types*
   * @property {external:Number} mreward *Only available on NORMAL block types*
   * @property {external:Number} mfee *Only available on NORMAL block types*
   * @property {external:Number} amount *Only available on NORMAL, GENESIS and
   * NEOGENESIS block types*
   * @property {external:Number} tcount *Only available on NORMAL block types*
   * @property {external:Number} transactions *Only available on NORMAL block
   * types*
   * @property {external:Number} lcount *Only available on GENESIS and
   * NEOGENESIS block types*
   * @property {external:Number} ledger *Only available on GENESIS and
   * NEOGENESIS block types
   * @param {external:Boolean} minify Limits string properties to 64 characters
   * and removes transactions/ledger array.
   * @return {external:Object} Block class object, in JSON format */
  toJSON (minify) {
    const json = {};
    // add block type
    json.type = this.type;
    // add block size, in byte
    json.size = this.byteLength;
    // add partial trailer data
    json.bnum = this.bnum;
    json.time0 = this.time0;
    json.stime = this.stime;
    json.difficulty = this.difficulty;
    // add hash data
    json.bhash = this.bhash;
    json.phash = this.phash;
    // add associated mining or ledger data on normal or (neo)genesis blocks
    if (json.type === Block.NORMAL) {
      json.mroot = this.mroot;
      json.nonce = this.nonce;
      json.maddr = this.maddr;
      json.mreward = this.mreward;
      json.mfee = this.mfee;
      json.amount = this.amount;
      json.tcount = this.tcount;
      if (minify) json.maddr = json.maddr.slice(0, 64);
      else json.transactions = this.transactions;
    } else if (json.type === Block.NEOGENESIS || json.type === Block.GENESIS) {
      json.amount = this.amount;
      json.lcount = parseInt((this.hdrlen - 4) / 2216);
      if (!minify) json.ledger = this.ledger;
    }
    return json;
  }

  /**
   * @desc Verify the block hash contained within a Block object.
   * @param {external:String=} hash Optional hash to verify against
   * @return {external:Boolean} Verified status of block hash */
  verifyBlockHash (hash) {
    const update = this.subarray(0, -32);
    const sha256 = createHash('sha256').update(update).digest('hex');
    return Boolean(sha256 === (hash || this.bhash));
  }

  /**
   * @type {external:String}
   * @constant_value `"invalid"`
   * @desc Represents an invalid block type */
  static get INVALID () {
    return 'invalid';
  }

  /**
   * @type {external:String}
   * @constant_value `"normal"`
   * @desc Represents a normal block type */
  static get NORMAL () {
    return 'normal';
  }

  /**
   * @type {external:String}
   * @constant_value `"genesis"`
   * @desc Represents a genesis block type */
  static get GENESIS () {
    return 'genesis';
  }

  /**
   * @type {external:String}
   * @constant_value `"neogenesis"`
   * @desc Represents a neogenesis block type */
  static get NEOGENESIS () {
    return 'neogenesis';
  }

  /**
   * @type {external:String}
   * @constant_value `"pseudo"`
   * @desc Represents a pseudo block type */
  static get PSEUDO () {
    return 'pseudo';
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

module.exports = { Tfile, Block, BlockTrailer, TXEntry, LEntry };
