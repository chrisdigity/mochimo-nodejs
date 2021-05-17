
/* globals BigInt */

/* requirements */
const {
  array2string,
  sanitizeUint8Array,
  sanitizeNumber
} = require('./util.js');
const {
  HASHLEN, TXADDRLEN, TXSIGLEN, OP_TX,
  TXVERSIONp, TXCBITSp, TXNETWORKp, TXID1p, TXID2p, TXOPCODEp, TXCBLOCKp,
  TXBLOCKNUMp, TXCBLOCKHASHp, TXPBLOCKHASHp, TXWEIGHTp, TXLENp, TXSRCADDRp,
  TXDSTADDRp, TXCHGADDRp, TXSENDTOTALp, TXCHANGETOTALp, TXTXFEEp, TXTXSIGp,
  TXCRC16p, TXTRAILERp, CRC16TABLE
} = require('./constants.js');

/**
 * @typicalname tx
 * @augments {external:Uint8Array}
 * @classdesc The Tx class is a Uint8Array of static size representing the
 * Transaction Buffer used to communicate with network peers. */
class Tx extends Uint8Array {
  /**
   * *FOR ADVANCED USE ONLY!*<br>Although the Tx class *can* be instantiated
   * directly, it is **not recommended.**<br>Instead, consider using the static
   * functions in the {@link Node} class. */
  constructor () {
    // force Tx.length (8920) array length, with new underlying ArrayBuffer
    super(Tx.length);
  }

  /**
   * Get/Set the I/O Block number of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get blocknum () {
    return new DataView(this.buffer).getBigUint64(TXBLOCKNUMp, true);
  }

  set blocknum (blocknum) {
    new DataView(this.buffer).setBigUint64(TXBLOCKNUMp, BigInt(blocknum), true);
  }

  /**
   * Get/Set the Capability Bits of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @see {@link #module_Mochimo..constants|Mochimo.constants}
   * @type {external:Number}
   * @default 0 */
  get cbits () {
    return new DataView(this.buffer).getUint8(TXCBITSp);
  }

  set cbits (cbits) {
    new DataView(this.buffer).setUint8(TXCBITSp, sanitizeNumber(cbits,
      'Tx.cbits'));
  }

  /**
   * Get/Set the Current Block number of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get cblock () {
    return new DataView(this.buffer).getBigUint64(TXCBLOCKp, true);
  }

  set cblock (cblock) {
    new DataView(this.buffer).setBigUint64(TXCBLOCKp, BigInt(cblock), true);
  }

  /**
   * Get/Set the Current Block Hash of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 64 hexadecimal character String or 32 byte Array.
   * @type {external:String}
   * @default "0000... <64 characters>" */
  get cblockhash () {
    return array2string(this.subarray(TXCBLOCKHASHp, TXPBLOCKHASHp));
  }

  set cblockhash (cblockhash) {
    this.set(sanitizeUint8Array('Tx.cblockhash', { cblockhash }, HASHLEN,
      HASHLEN), TXCBLOCKHASHp);
  }

  /**
   * Get/Set the Transaction Change Amount of a Transaction Buffer. Value
   * represents nanoMochimo.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get changetotal () {
    return new DataView(this.buffer).getBigUint64(TXCHANGETOTALp, true);
  }

  set changetotal (changetotal) {
    new DataView(this.buffer).setBigUint64(TXCHANGETOTALp, BigInt(changetotal),
      true);
  }

  /**
   * Get/Set the Transaction Change Address of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 4416 hexadecimal character String or 2208 byte Array.
   * @type {external:String}
   * @default "0000... <4408 characters>" */
  get chgaddr () {
    return array2string(this.subarray(TXCHGADDRp, TXSENDTOTALp));
  }

  set chgaddr (chgaddr) {
    this.set(sanitizeUint8Array('Tx.chgaddr', { chgaddr }, TXADDRLEN,
      TXADDRLEN), TXCHGADDRp);
  }

  /**
   * Get/Set the CRC16 Hash of a Transaction Buffer<br><sup>
   * &ast;Setting this property is **NOT RECOMMENDED**
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 0 */
  get crc16 () {
    return new DataView(this.buffer).getUint16(TXCRC16p, true);
  }

  set crc16 (crc16) {
    new DataView(this.buffer).setUint16(TXCRC16p, sanitizeNumber(crc16,
      'Tx.crc16'), true);
  }

  /**
   * Get/Set the Transaction Destination Address of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 4416 hexadecimal character String or 2208 byte Array.
   * @type {external:String}
   * @default "0000... <4408 characters>" */
  get dstaddr () {
    return array2string(this.subarray(TXDSTADDRp, TXCHGADDRp));
  }

  set dstaddr (dstaddr) {
    this.set(sanitizeUint8Array('Tx.dstaddr', { dstaddr }, TXADDRLEN,
      TXADDRLEN), TXDSTADDRp);
  }

  /**
   * Get/Set the first ID of a Transaction Buffer.<br><sup>
   * &ast;Setting this property is **NOT RECOMMENDED**
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 0 */
  get id1 () {
    return new DataView(this.buffer).getUint16(TXID1p, true);
  }

  set id1 (id1) {
    new DataView(this.buffer).setUint16(TXID1p, sanitizeNumber(id1,
      'Tx.id1'), true);
  }

  /**
   * Get/Set the second ID of a Transaction Buffer.<br><sup>
   * &ast;Setting this property is **NOT RECOMMENDED**
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default -1 */
  get id2 () {
    return new DataView(this.buffer).getUint16(TXID2p, true);
  }

  set id2 (id2) {
    new DataView(this.buffer).setUint16(TXID2p, sanitizeNumber(id2,
      'Tx.id2'), true);
  }

  /**
   * Get/Set the Transaction Length of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 0 */
  get len () {
    return new DataView(this.buffer).getUint16(TXLENp, true);
  }

  set len (len) {
    new DataView(this.buffer).setUint16(TXLENp, sanitizeNumber(len,
      'Tx.len'), true);
  }

  /**
   * Get/Set&ast; the Network Version of a Transaction Buffer.<br><sup>
   * &ast;Setting this property is **NOT RECOMMENDED**
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 0xABCD */
  get network () {
    return new DataView(this.buffer).getUint16(TXNETWORKp, true);
  }

  set network (network) {
    new DataView(this.buffer).setUint16(TXNETWORKp, sanitizeNumber(network,
      'Tx.network'), true);
  }

  /**
   * Get/Set the Operation Code of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @see {@link #module_Mochimo..constants|Mochimo.constants}
   * @type {external:Number}
   * @default OP_NULL */
  get opcode () {
    return new DataView(this.buffer).getUint16(TXOPCODEp, true);
  }

  set opcode (opcode) {
    new DataView(this.buffer).setUint16(TXOPCODEp, sanitizeNumber(opcode,
      'Tx.opcode'), true);
  }

  /**
   * Get/Set the Previous Block Hash of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 64 hexadecimal character String or 32 byte Array.
   * @type {external:String}
   * @default "0000... <64 characters>" */
  get pblockhash () {
    return array2string(this.subarray(TXPBLOCKHASHp, TXWEIGHTp));
  }

  set pblockhash (pblockhash) {
    this.set(sanitizeUint8Array('Tx.pblockhash', { pblockhash }, HASHLEN,
      HASHLEN), TXPBLOCKHASHp);
  }

  /**
   * Get/Set the Protocol Version of a Transaction Buffer.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 4 */
  get pversion () {
    return new DataView(this.buffer).getUint8(TXVERSIONp);
  }

  set pversion (protocol) {
    new DataView(this.buffer).setUint8(TXVERSIONp, sanitizeNumber(protocol,
      'Tx.pversion'));
  }

  /**
   * Get/Set the Transaction Send Amount of a Transaction Buffer. Value
   * represents nanoMochimo.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get sendtotal () {
    return new DataView(this.buffer).getBigUint64(TXSENDTOTALp, true);
  }

  set sendtotal (sendtotal) {
    new DataView(this.buffer).setBigUint64(TXSENDTOTALp, BigInt(sendtotal),
      true);
  }

  /**
   * Get/Set the Transaction Source Address of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 4416 hexadecimal character String or 2208 byte Array.
   * @type {external:String}
   * @default "0000... <4408 characters>" */
  get srcaddr () {
    return array2string(this.subarray(TXSRCADDRp, TXDSTADDRp));
  }

  set srcaddr (srcaddr) {
    this.set(sanitizeUint8Array('Tx.srcaddr', { srcaddr }, TXADDRLEN,
      TXADDRLEN), TXSRCADDRp);
  }

  /**
   * Get/Set the Trailer of a Transaction Buffer.<br><sup>
   * &ast;Setting this property is **NOT RECOMMENDED**
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:Number}
   * @default 0 */
  get trailer () {
    return new DataView(this.buffer).getUint16(TXTRAILERp, true);
  }

  set trailer (value) {
    new DataView(this.buffer).setUint16(TXTRAILERp, sanitizeNumber(value,
      'Tx.trailer'), true);
  }

  /**
   * Get/Set the Transaction Fee Amount of a Transaction Buffer. Value
   * represents nanoMochimo.
   * @throws {TypeError} when set value cannot be converted to the original type
   * @type {external:BigInt}
   * @default 0n */
  get txfee () {
    return new DataView(this.buffer).getBigUint64(TXTXFEEp, true);
  }

  set txfee (txfee) {
    new DataView(this.buffer).setBigUint64(TXTXFEEp, BigInt(txfee), true);
  }

  /**
   * Get/Set the Transaction Signature of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 4288 hexadecimal character String or 2144 byte Array.
   * @type {external:String}
   * @default 0n */
  get txsig () {
    return array2string(this.subarray(TXTXSIGp, TXCRC16p));
  }

  set txsig (txsig) {
    this.set(sanitizeUint8Array('Tx.txsig', { txsig }, TXSIGLEN, TXSIGLEN),
      TXTXSIGp);
  }

  /**
   * Get/Set the Blockchain Weight of a Transaction Buffer.
   * @throws {TypeError} when set an invalid data type&ast;<br><sup>*Valid data
   * types are hexadecimal {@link external:String}, {@link external:Array} or
   * {@link external:TypedArray}.
   * @throws {TypeError} when set a value of invalid length&ast;<br><sup>
   * &ast;Must be 1-64 hexadecimal character String or 1-32 byte Array.
   * @type {external:String}
   * @default "0... <up to 64 characters>" */
  get weight () {
    return array2string(this.subarray(TXWEIGHTp, TXLENp), 16, true, false);
  }

  set weight (weight) {
    this.set(sanitizeUint8Array('Tx.weight', { weight }, 32, 1, true),
      TXWEIGHTp);
  }

  /**
   * Perform a CRC16 hash on 8916 bytes of the underlying transaction buffer.
   * <br><sup>*This function was ported directly from the Mochimo Codebase
   * crc16.c file*
   * @return {external:Number} The CRC16 hash value (16 bit unsigned) */
  crc16compute () {
    let crc = 0;
    const buff = this.subarray(0, TXCRC16p);
    for (let i = 0; i < buff.length; i++) {
      crc = ((crc & 0xff) << 8) ^ CRC16TABLE[((crc >>> 8) & 0xff) ^ buff[i]];
    }
    return crc;
  }

  /**
   * Validate the CRC16 hash value of the Tx this function is called.
   * @return {external:Boolean} Result of validation */
  crc16test () {
    if (this.crc16compute() === this.crc16) return true;
    return false;
  }

  /**
   * Obtain the Transaction Data of a Transaction Buffer (Tx) in a new typed
   * array (with a new underlying buffer).
   * @return {external:Uint8Array} */
  getTxData () {
    return this.slice(TXSRCADDRp, TXCRC16p);
  }

  /**
   * @property {external:Number} pversion *refer to Tx class properties*
   * @property {external:Number} cbits
   * @property {external:Number} network
   * @property {external:Number} id1
   * @property {external:Number} id2
   * @property {external:Number} opcode
   * @property {external:BigInt} cblock
   * @property {external:BigInt} blocknum
   * @property {external:String} cblockhash
   * @property {external:String} pblockhash
   * @property {external:String} weight
   * @property {external:Number} len
   * @property {external:Uint8Array} data *present only if opcode != `OP_TX`*
   * @property {external:Uint8Array} srcaddr *present only if opcode is `OP_TX`*
   * @property {external:Uint8Array} dstaddr *present only if opcode is `OP_TX`*
   * @property {external:Uint8Array} chgaddr *present only if opcode is `OP_TX`*
   * @property {external:BigInt} sendtotal *present only if opcode is `OP_TX`*
   * @property {external:BigInt} changetotal *present only if opcode is `OP_TX`*
   * @property {external:BigInt} txfee *present only if opcode is `OP_TX`*
   * @property {external:Uint8Array} txsig *present only if opcode is `OP_TX`*
   * @property {external:Number} crc16
   * @property {external:Number} trailer
   * @return {external:Object} Tx class object, in JSON format */
  toJSON () {
    const json = {
      pversion: this.pversion,
      cbits: this.cbits,
      network: this.network,
      id1: this.id1,
      id2: this.id2,
      opcode: this.opcode,
      cblock: this.cblock,
      blocknum: this.blocknum,
      cblockhash: this.cblockhash,
      pblockhash: this.pblockhash,
      weight: this.weight,
      len: this.len,
      crc16: this.crc16,
      trailer: this.trailer
    };
    if (this.opcode === OP_TX) {
      json.srcaddr = this.srcaddr;
      json.dstaddr = this.dstaddr;
      json.chgaddr = this.chgaddr;
      json.sendtotal = this.sendtotal;
      json.changetotal = this.changetotal;
      json.txfee = this.txfee;
      json.txsig = this.txsig;
    } else json.data = this.getTxData();
    // return finalised json
    return json;
  }

  /**
   * @type {external:Number}
   * @constant_value `8920`
   * @desc Breakdown:
   * - 2x Bytes (8bit), 2 bytes
   * - 6x Words (16bit), 12 bytes
   * - 2x Blocknumbers (64bit), 16bytes
   * - 3x WOTS+ (inc. tag), 6624 bytes
   * - 3x Amounts (64bit), 24 bytes
   * - 1x Signature (WOTS+), 2144 bytes
   * - 3x Hashes (sha256), 96 bytes */
  static get length () {
    return 8920;
  }

  // Overwrite Tx species to the parent Uint8Array constructor
  static get [Symbol.species] () {
    return Uint8Array;
  }
}

module.exports = Tx;
