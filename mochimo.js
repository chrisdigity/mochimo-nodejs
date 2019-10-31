/* Dev Notes.
 *
 * Development IDE: Atom;
 * Development Linter: eslint-config-google;
 *
 * Notes:
 * #I am using ES6 variable declarations (let & const) but I am not using
 *  classes. Due to the nature of this implementation, JavaScript classes
 *  offer nothing more than "syntactic sugar" and I prefer the "Readability" of
 *  ES5 with regards to constant and private variables in functions/classes.
 *  On the other hand, I might have glossed over a nicer format.
 */


/**
 * Required Core Modules: fs, net, util;
 * @module
 * @example
 * const Mochimo = require('mochimo');
 */


/* JsDoc Type Links */
/**
 * @external Boolean
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type */
/**
 * @external Number
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type */
/**
 * @external String
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type */
/**
 * @external Object
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects */
/**
 * @external Function
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions */
/**
 * @external ArrayBuffer
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer */
/**
 * @external Uint8Array
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array */
/**
 * @external Socket
 * @see https://nodejs.org/api/net.html#net_class_net_socket */
/**
 * @external Node
 * @see #module_mochimo..Node */
/**
 * @external NodeInfo
 * @see #module_mochimo..NodeInfo */


/* JsDoc Typedefs */
/**
 * @typedef {external:Object} Node
 * @property {external:String} ip IPv4 address of the Node
 * @property {external:Number} id1 3-way handshake verification ID #1
 * @property {external:Number} id2 3-way handshake verification ID #2
 * @property {external:Number} called Time (in ms) when the socket communication
 * was intiated
 * @property {external:String} status The assumed remote status of the Node
 * @property {external:Uint8Array} tx Socket transaction data
 * @property {external:ArrayBuffer} data Socket intended data
 * @property {external:Number} txp Socket transaction data pointer
 * @property {external:Number} datap Socket intended data pointer
 * @property {external:Socket|external:Number} socket The Socket object that
 * handles the communication with a Node.<br>INVALID_SOCKET when unused */
/**
 * @typedef {external:Object} NodeInfo
 * @property {external:Number} version Protocol version
 * @property {external:Number} cbits Compatibility bits
 * @property {external:Number} network Network version
 * @property {external:Number} opcode Last opcode received
 * @property {external:Uint8Array} bnum I/O block number (64 bit little endian)
 * @property {external:Uint8Array} cbnum Current block number (64 bit little
 * endian)
 * @property {external:Uint8Array} chash Current block hash (32 bytes)
 * @property {external:Uint8Array} phash Previous block hash (32 bytes)
 * @property {external:Uint8Array} weight Current chain weight (32 bytes) */


/* Pre-Checks */
/* eslint-env es6 */
/* eslint-disable no-unused-vars */
(function() {
  /* Check 32 bits of precision is available */
  const max32 = 1 << 31;
  const max16 = 1 << 15;
  if (max32 & max16 !== max16 || (max32 >>> 16) & max16 !== max16) {
    throw new Error('Precision loss detected! 32 bit precision required.');
  }
  /* Check Little Endian operation */
  const abuff = new ArrayBuffer(2);
  const uint8a = new Uint8Array(abuff);
  const uint16a = new Uint16Array(abuff);
  uint16a[0] = 0x0123;
  if (uint8a[0] !== 0x23 ) {
    throw new Error('Big Endian detected! Little Endian operation required.');
  }
  /* ArrayBuffer.transfer() POLYFILL from MDN:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer#Polyfill */
  if (!ArrayBuffer.transfer) {
    ArrayBuffer.transfer = function(source, length) {
      if (!(source instanceof ArrayBuffer)) {
        throw new TypeError('Source must be an instance of ArrayBuffer');
      }
      if (length <= source.byteLength) {
        return source.slice(0, length);
      }
      const sourceView = new Uint8Array(source);
      const destView = new Uint8Array(new ArrayBuffer(length));
      destView.set(sourceView);
      return destView.buffer;
    };
  }
})();


/* Core NodeJS Modules */
const fs = require('fs');
const net = require('net');
const util = require('util');


/* Reporting functions */
const log = function(format, ...args) {
  if (args === null) {
    args = [];
  }
  args.unshift(format);
  process.stdout.write(util.format.apply(null, args));
  return VEOK;
};
const logn = function(format, ...args) {
  if (args === null) {
    args = [];
  }
  args.unshift(format + '\n');
  process.stdout.write(util.format.apply(null, args));
  return VEOK;
};
const error = function(format, ...args) {
  if (args === null) {
    args = [];
  }
  args.unshift('**' + format + '\n');
  process.stderr.write(util.format.apply(null, args));
  return VERROR;
};
const fatal = function(format, ...args) {
  if (args === null) {
    args = [];
  }
  args.unshift('**!**' + format);
  throw new Error(util.format.apply(null, args));
};


/**
 * The Process ID of the NodeJs process that calls the module.
 * @const {external:Number}
 * @private */
const PID = process.pid;
/**
 * Standard Mochimo Network communications port.<br>**Value:** `2095`
 * @const {external:Number}
 * @private */
const PORT = 2095;
/**
 * Return status for no issues.<br>**Value:** `0`
 * @const {external:Number} */
const VEOK = 0;
/**
 * Return status for a failure.<br>**Value:** `1`
 * @const {external:Number} */
const VERROR = 1;
/**
 * Return status for a failure and possible malice.<br>**Value:** `2`
 * @const {external:Number} */
const VEBAD = 2;
/**
 * Return status for a timeout.<br>**Value:** `-1`
 * @const {external:Number} */
const VETIMEOUT = (-1);
/**
 * Placeholder for an unused [net.Socket](https://nodejs.org/api/net.html#net_class_net_socket)
 * variable.<br>**Value:** `-1`
 * @const {external:Number} */
const INVALID_SOCKET = (-1);
/**
 * Compatibility bit indicating the availability of Block Pushing transactions
 * used by the Mochimo Windows Headless Miner.<br>**Value:** `1`
 * @const {external:Number} */
const C_PUSH = 1;
/**
 * Compatibility bit indicating the operation of a wallet.<br>**Value:** `2`
 * @const {external:Number} */
const C_WALLET = 2;
/**
 * Compatibility bit indicating to the network that the node has activated the
 * Sanctuary Protocol.<br>**Value:** `4`
 * @const {external:Number} */
const C_SANCTUARY = 4;
/**
 * Compatibility bit indicating the desired Fee change outcome of the Sanctuary
 * Protocol.<br>**Value:** `8`
 * @const {external:Number} */
const C_MFEE = 8;
/**
 * Compatibility bit indicating the availability of Logging.<br>**Value:** `16`
 * @const {external:Number} */
const C_LOGGING = 16;
/**
 * Null operation code. Not used but usually indicating a lack of socket
 * initialization during a transaction of data.<br>**Value:** `0`
 * @const {external:Number} */
const OP_NULL = 0;
/**
 * Hello operation code. Used as a request code to initiate the first step of a
 * Mochimo 3-way handshake.<br>**Value:** `1`
 * @const {external:Number} */
const OP_HELLO = 1;
/**
 * Hello Acknowledgement operation code. Used as a return code to indicate the
 * second step of a Mochimo 3-way handshake.<br>**Value:** `2`
 * @const {external:Number} */
const OP_HELLO_ACK = 2;
/**
 * Transaction operation code. Used as a request code to send a signed
 * transaction to a Node for distribution across the Mochimo Network.
 * <br>**Value:** `3`
 * @const {external:Number} */
const OP_TX = 3;
/**
 * Block Found operation code. Used as a network alert code indicating the
 * existence of a new block update available for download. To obtain the block
 * update, a new socket connection and opcode must be used.<br>**Value:** `4`
 * @const {external:Number} */
const OP_FOUND = 4;
/**
 * Get Block operation code. Used as a request code to get/download a block from
 * a Node. This operation can take some time if requesting a neogensis block,
 * due to network speed and ledger file size.<br>**Value:** `5`
 * @const {external:Number} */
const OP_GETBLOCK = 5;
/**
 * Get IP List operation code. Used as a request code when requesting a Node's
 * peer list.<br>**Value:** `6`
 * @const {external:Number} */
const OP_GETIPL = 6;
/**
 * Send Block operation code. Used as a return code for validation when sending
 * a block, usually after an OP_GETBLOCK is received.<br>**Value:** `7`
 * @const {external:Number} */
const OP_SEND_BL = 7;
/**
 * Send IP List operation code. Used as a validation code when sending a peer
 * list, usually after an OP_GETIPL is received.<br>**Value:** `8`
 * @const {external:Number} */
const OP_SEND_IP = 8;
/**
 * Busy operation code. Used as a return code to indicate that a Node is
 * currently busy and unable to process a request.<br>**Value:** `9`
 * @const {external:Number} */
const OP_BUSY = 9;
/**
 * No Acknowledgement operation code? The workings of this code is currently
 * unknown, as it is unused throughout the codebase. I'm sure if I was to ask of
 * it's original purpose I would get a clear and concise response. For now, this
 * obnoxiously unhelpful description will serve as one of my adequate systems of
 * unusual humor.<br>**Value:** `10`
 * @const {external:Number} */
const OP_NACK = 10;
/**
 * Get Trailer File operation code. Used as a request code to get/download a
 * Node's entire Tfile. This operation can take some time, due to network speed
 * and Tfile size.<br>**Value:** `11`
 * @const {external:Number} */
const OP_GET_TFILE = 11;
/**
 * Address Balance operation code. Used as a request code when requesting the
 * balance of a Mochimo Address.<br>**Value:** `12`
 * @const {external:Number} */
const OP_BALANCE = 12;
/**
 * Send Address Balance operation code. Used as a return code for validation
 * when sending the balance of a Mochimo Address.<br>**Value:** `13`
 * @const {external:Number} */
const OP_SEND_BAL = 13;
/**
 * Resolve Tag operation code. Used as a request/return code when requesting the
 * Mochimo Address registered to a Mochimo Tag.<br>**Value:** `14`
 * @const {external:Number} */
const OP_RESOLVE = 14;
/**
 * Get Candidate Block operation code. Used as a request code to get/download a
 * candidate block from a Node. Candidate blocks include all recent transactions
 * for a Windows Headless Miner to find a solution to.<br>**Value:** `15`
 * @const {external:Number} */
const OP_GET_CBLOCK = 15;
/**
 * Mined Block operation code. Used as a network alert code indicating that a
 * Windows Headless Miner has found a solution to a candidate block it received
 * and requires assistance distributing the block update. Unlike OP_FOUND, the
 * socket connection stays open to continue sending the block update along with
 * OP_SEND_BL.<br>**Value:** `16`
 * @const {external:Number} */
const OP_MBLOCK = 16;
/**
 * Block Hash operation code. Used as a request/return code when requesting the
 * block hash of a specified block number.<br>**Value:** `17`
 * @const {external:Number} */
const OP_HASH = 17;
/**
 * Partial Trailer File operation code. Used as a request code to get/download a
 * section of a Trailer File. Requests can be up to 1000 trailers in size, and
 * the operation is validated with an OP_SEND_BL return code.<br>**Value:** `18`
 * @const {external:Number} */
const OP_TF = 18;
/**
 * Identify operation code. Used as a request/return code to identify which
 * nodes have activated the Sanctuary protocol and obtain their Santuary
 * specifications.<br>**Value:** `19`
 * @const {external:Number} */
const OP_IDENTIFY = 19;
const FIRST_OP = OP_TX;
const LAST_OP = OP_IDENTIFY;
const OP_LIST = ['OP_NULL', 'OP_HELLO', 'OP_HELLO_ACK', 'OP_TX', 'OP_FOUND',
  'OP_GETBLOCK', 'OP_GETIPL', 'OP_SEND_BL', 'OP_SEND_IP', 'OP_BUSY',
  'OP_NACK', 'OP_GET_TFILE', 'OP_BALANCE', 'OP_SEND_BAL', 'OP_RESOLVE',
  'OP_GET_CBLOCK', 'OP_MBLOCK', 'OP_HASH', 'OP_TF', 'OP_IDENTIFY'];

/* TX Constants */
const HASHLEN = 32;
const TXADDRLEN = 2208;
const TXAMOUNTLEN = 8;
const TXSIGLEN = 2144;
const TRANLEN = 8792; /* (TXADDRLEN*3) + (TXAMOUNTLEN*3) + TXSIGLEN */
const SIG_HASH_COUNT = 6648; /* TRANLEN - TXSIGLEN */
const TXBUFFLEN = 8920; /* (2 * 5) + (TXAMOUNTLEN * 2) + (HASHLEN * 3) + 2 +
    (TXADDRLEN * 3) + (TXAMOUNTLEN * 3) + TXSIGLEN + (2 * 2) */
const CRC_COUNT = (-4);
const TXNETWORK = 0x0539;
const TXEOT = 0xabcd;

/**
 * Mochimo Core is the base class of the NodeJs implementation. It contains
 * protocols and functions necessary for integration with the Mochimo Network.
 * Mochimo Core is most useful for utilizing or extending this functionality
 * into your own application. Developers who wish to create a truly custom
 * application that integrates into the Mochimo Network should start here.
 * @class
 * @example
 * const {Core} = require('mochimo');
 * const MochimoCore = new Core();
 */
function Core() {
  /* self */
  const self = this;
  /* TX pointers */
  const TXVERSIONp = 0;
  const TXNETWORKp = 2;
  const TXID1p = 4;
  const TXID2p = 6;
  const TXOPCODEp = 8;
  const TXCBLOCKp = 10;
  const TXBLOCKNUMp = 18;
  const TXCBLOCKHASHp = 26;
  const TXPBLOCKHASHp = 58;
  const TXWEIGHTp = 90;
  const TXLENp = 122;
  const TXSRCADDRp = 124;
  const TXDSTADDRp = 2332;
  const TXCHGADDRp = 4540;
  const TXSENDTOTALp = 6748;
  const TXCHANGETOTALp = 6756;
  const TXTXFEEp = 6764;
  const TXTXSIGp = 6772;
  const TXCRC16p = (-4);
  const TXTRAILERp = (-2);
  /* Regex tests */ /* eslint-disable-next-line max-len */
  const isIPv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  /* CRC16 Table */
  const CRC16TABLE = new Uint16Array([
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
    0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
    0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
    0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
    0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
    0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
    0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
    0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
    0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
    0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
    0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
    0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
    0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
    0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
    0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
    0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
    0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
  ]);
  /* local */
  const CurrentPeers = [];
  const RecentPeers = [];
  const Mapping = [];
  const Mapped = [];
  const Cblocknum = new Uint8Array(8);
  const Cblockhash = new Uint8Array(HASHLEN);
  const Prevhash = new Uint8Array(HASHLEN);
  const Weight = new Uint8Array(HASHLEN);
  let Debug = 0;
  let Corems = 100;
  let Pversion = 4;
  let Cbits = 0;
  let Running = false; /* eslint-disable-line prefer-const */
  let Ltime = (Date.now() / 1000) >>> 0; /* eslint-disable-line prefer-const */
  let Mtimeout = null;
  let Mstopwatch = VEOK;
  let dstPort = PORT;
  let maxSockets = 32;
  let curSockets = 0;
  /* default initial seed for Mochimo PRNG */
  let Lseed = PID ^ Ltime;
  let Lseed2 = Ltime;
  let Lseed3 = 0;
  let Lseed4 = PID ^ 123456789;
  /* memory control functions */
  const memcpy = function(dst, src, size, offset) {
    offset = offset || 0;
    for (let i = 0; i < size; i++) {
      dst[offset + i] = src[i];
    }
  };
  /* 32 bit unsigned integer math */
  const uadd32 = function(a, b) {
    return ((a >>> 0) + (b >>> 0)) >>> 0;
  };
  const umul32 = function(a, b) {
    a >>>= 0;
    b >>>= 0;
    const alo = a & 0xffff;
    const ahi = a - alo;
    return (((ahi * b) >>> 0) + (alo * b)) >>> 0;
  };
  /* Mochimo codebase -> crc16.c (JS adaptation) */
  const crc16 = function(buff, len) {
    while (len < 0) len += buff.length;
    let crc = 0;
    for (let i = 0; i < len; i++) {
      crc = ((crc & 0xff) << 8) ^ CRC16TABLE[((crc >>> 8) & 0xff) ^ buff[i]];
    }
    return crc;
  };
  /* Mochimo codebase -> rand.c (32bit JS adaptation) */
  const rand16 = function() {
    Lseed = ((Lseed * 69069) + 262145) >>> 0;
    return (Lseed >>> 16);
  };
  const rand2 = function() {
    Lseed2 = ((Lseed2 * 69069) + 262145) >>> 0;
    if (Lseed3 == 0) Lseed3 = 362436069;
    Lseed3 = 36969 * (Lseed3 & 65535) + (Lseed3 >>> 16);
    if (Lseed4 == 0) Lseed4 = 123456789;
    Lseed4 ^= (Lseed4 << 17);
    Lseed4 ^= (Lseed4 >>> 13);
    Lseed4 ^= (Lseed4 << 5);
    return (Lseed2 ^ (Lseed3 << 16) ^ Lseed4) >> 16;
  };
  /* Mochimo codebase -> util.c (JS adaptation) */
  const get16 = function(buff, offset) {
    offset = offset || 0;
    while (offset < 0) offset += buff.length;
    return buff[offset] | (buff[offset + 1] << 8);
  };
  const put16 = function(buff, val16, offset) {
    offset = offset || 0;
    while (offset < 0) offset += buff.length;
    buff[offset] = val16;
    buff[offset + 1] = val16 >>> 8;
  };
  const get32 = function(buff, offset) {
    offset = offset || 0;
    while (offset < 0) offset += buff.length;
    return buff[offset] | (buff[offset + 1] << 8) |
      (buff[offset + 2] << 16) | (buff[offset + 3] << 24);
  };
  const put32 = function(buff, val32, offset) {
    offset = offset || 0;
    while (offset < 0) offset += buff.length;
    buff[offset] = val32;
    buff[offset + 1] = val16 >>> 8;
    buff[offset + 2] = val16 >>> 16;
    buff[offset + 3] = val16 >>> 24;
  };
  const ntoa = function(uint32) {
    return (uint32 & 0xff) + '.' +
      ((uint32 >>> 8) & 0xff) + '.' +
      ((uint32 >>> 16) & 0xff) + '.' +
      ((uint32 >>> 24) & 0xff);
  };
  const byte2hex = function(buff, maxlen, offset) {
    let hex = '';
    let i = maxlen - 1;
    /* scan for first non-zero byte, halting for final byte */
    while (i > 0 && buff[offset + i] == 0) i--;
    /* print remaining bytes */
    for (; i >= 0; i--) {
      hex += ('00' + buff[offset + i].toString(16)).substr(-2);
    }
    return hex;
  };
  const byte2bit = function(buff, maxlen, offset) {
    /* Convert "maxlen" bytes to a binary string */
    let bit = '';
    let i = maxlen - 1;
    /* scan for first non-zero byte, halting for final byte */
    while (i > 0 && buff[offset + i] == 0) i--;
    /* print remaining bytes as binary string */
    for (; i >= 0; i--) {
      for (let j = 0x80; j > 0; j >>>= 1) {
        bit += (buff[offset + i] & j) ? '1' : '0';
      }
      if (i) bit += ' ';
    }
    return bit;
  };
  /* peer management */
  const addPeer = function(peer, peerlist) {
    const fid = 'Core.addPeer()-> ';
    let result = 0;
    /* check parameter is valid */
    if (typeof peer !== 'undefined' && peer) {
      /* determine peer type */
      switch (typeof peer) {
        case 'number':
          /* convert number to string */
          peer = ntoa(peer);
        case 'string':
          /* check string is valid IPv4 address */
          if (isIPv4.test(peer)) {
            /* check for existing ip in list */
            if (peerlist.indexOf(peer) == (-1)) {
              /* add peer to list */
              peerlist.push(peer);
              result++;
            }
            if (Debug > 1) {
              logn('%s%s added to list', fid, peer);
            }
          }
          break;
        case 'object':
          /* check for valid array */
          if (Array.isArray(peer) && peer.length) {
            /* extract array values */
            for (let i = 0; i < peer.length; i++) {
              result += addPeer(peer[i], peerlist);
            }
            if (Debug) {
              logn('%s%d peers added to list', fid, result);
            }
          }
        default:
          if (Debug) {
            error('%sIgnoring invalid IPv4 address', fid);
          }
      } /* end switch (typeof peer... */
    }
    return result;
  };
  const removePeer = function(peer, peerlist) {
    /* check parameter is valid */
    if (typeof peer !== 'undefined' && peer) {
      /* find ip reference */
      const id = peerlist.indexOf(peer);
      if (id > (-1)) {
        return peerlist.splice(id, 1)[0];
      }
    }
    return null;
  };
  /* Mochimo codebase -> call.c, gettx.c, execute.c (JS adaptation) */
  const prepareTx = function(node, opcode) {
    node.opcode = opcode;
    /* from what I've seen, tx should always be TXBUFFLEN...
    switch (node.opcode) {
      default:
        if (node.tx.length != TXBUFFLEN) {
          node.tx = new Uint8Array(TXBUFFLEN);
        }
    }
    */
    node.tx.fill(0); /* reset TX */
    node.txp = 0; /* reset TX pointer */
    put16(node.tx, Pversion | (Cbits << 8), TXVERSIONp);
    put16(node.tx, TXNETWORK, TXNETWORKp);
    put16(node.tx, node.id1, TXID1p);
    put16(node.tx, node.id2, TXID2p);
    put16(node.tx, node.opcode, TXOPCODEp);
    memcpy(node.tx, Cblocknum, 8, TXCBLOCKp);
    memcpy(node.tx, Cblockhash, HASHLEN, TXCBLOCKHASHp);
    memcpy(node.tx, Prevhash, HASHLEN, TXPBLOCKHASHp);
    if (opcode != OP_TX) {
      memcpy(node.tx, Weight, HASHLEN, TXWEIGHTp);
    }
    put16(node.tx, crc16(node.tx, CRC_COUNT), TXCRC16p);
    put16(node.tx, TXEOT, TXTRAILERp);
  };

  /**
   * Mochimo Node used for socket communication.
   * @private
   * @class
   * @param {string} ip=0.0.0.0 Sets the IPv4 address of the Node
   */
  function Node(ip) {
    /**
     * IPv4 address of the Node.
     * @type {external:String}
     * @default */
    this.ip = ip || '0.0.0.0';
    /**
     * 3-way handshake verification ID #1.
     * @type {external:Number} */
    this.id1 = 0;
    /**
     * 3-way handshake verification ID #2.
     * @type {external:Number} */
    this.id2 = (-1);
    /**
     * Time (in ms) when the socket communication was intiated.
     * @type {external:Number} */
    this.called = 0;
    /**
     * The assumed remote status of the Node.
     * @type {external:String} */
    this.status = null;
    /**
     * Socket transaction data.
     * @type {external:Uint8Array} */
    this.tx = new Uint8Array(TXBUFFLEN);
    /**
     * Socket intended data.
     * @type {external:ArrayBuffer} */
    this.data = new ArrayBuffer(0);
    /**
     * Socket transaction data pointer.
     * @type {external:Number} */
    this.txp = 0;
    /**
     * Socket intended data pointer.
     * @type {external:Number} */
    this.datap = 0;
    /**
     * The Socket object that handles the communication with the Node or
     * INVALID_SOCKET when unused.
     * @type {external:Socket|external:Number} */
    this.socket = INVALID_SOCKET;
  }
  /**
   * Private callback function that handles the response of the OP_GETIPL call
   * to a node during a mapNetwork() scan.
   * @private
   * @param {Core~Node} node - Node containing raw socket data
   */
  function mapNetworkResult(node) {
    /* shift from Mapping to Mapped */
    const removed = removePeer(node.ip, Mapping);
    addPeer(removed, Mapped);
    if (Debug > 2) {
      logn('Core.mapNetworkResult()-> Move %s, Mapping: %d, Mapped: %d',
          removed, Mapping.length, Mapped.length);
    }
    /* ignore irregular result */
    if (node.status !== VEOK) {
      return;
    }
    /* get peer list from tx */
    const len = node.data.byteLength;
    for (let i = 0; i < len; i += 4) {
      /* add only valid IPv4 addresses */
      const ip = ntoa(get32(node.data, i));
      if (isIPv4.test(ip)) {
        addPeer(ip, RecentPeers);
      }
    }
  }
  /**
   * Intermediate private function used to check the validity of number inputs
   * before being applied to local variables.
   * @private
   * @param {string} fid Function identifier, console output prefix
   * @param {number} num Number to check for validity
   * @param {number} min=-Infinity (Optional) Minimum number for validity check
   * @param {number} max=Infinity (Optional) Maximum number for validity check
   * @return {number} Integer status, VEOK if number validated ok
   */
  function setNumberCheck(fid, num, min, max) {
    if (Debug) {
      logn('%sCalled', fid);
    }
    /* define min/max defaults */
    if (typeof min !== 'number') {
      min = -Infinity;
    }
    if (typeof max !== 'number') {
      max = Infinity;
    }
    /* check number is real and within limits */
    if (!isNaN(num) && num >= min && num <= max) {
      return VEOK;
    }
    /* otherwise ignore */
    error('%sIgnoring invalid number', fid);
    return VERROR;
  }

  /**
   * Connect to a Mochimo Network Node and request data.<br>**Note:** Not
   * compatible with advanced opcode types requiring data to be sent with the
   * request.
   * @param {external:Function} callback Callback function, receives Node object
   * result
   * @param {external:String} peer IPv4 address of the Mochimo NODE
   * @param {external:Number} opcode Operation code to request
   * @return {external:Number} Status indicating the success of the function
   * @example
   * MochimoCore.callserver(function(node) {
   *   console.log('callserver() returned node:\n%j', node);
   * }, '127.0.0.1', OP_GETIPL);
   *
   * /* OUTPUT
   * callserver() returned node:
   * { "ip": "127.0.0.1", "id1": ...}
   */
  this.callserver = function(callback, peer, opcode) {
    const fid = util.format('Core.callserver(%s, %d)-> ', peer, opcode);
    if (curSockets >= maxSockets) {
      if (Debug > 1) {
        error('%sSocket limit reached...', fid);
      }
      return VERROR;
    }
    const node = new Node(peer);
    try {
      if (Debug > 1) {
        logn('%sCreate new socket...', fid);
      }
      node.socket = new net.Socket();
      curSockets++;
    } catch (e) {
      node.socket = INVALID_SOCKET;
      fatal('%s%s', fid, e);
    }
    /* Process events */
    node.socket.on('ready', function() {
      node.id1 = rand16();
      prepareTx(node, OP_HELLO);
      if (Debug) {
        logn('%sSend, OP_HELLO', fid);
      }
      node.socket.setTimeout(10000);
      node.socket.write(node.tx);
    });
    node.socket.on('data', function(data) {
      if (Debug > 1) {
        logn('%sRecv, id1=%d id2=%d...', fid, node.id1, node.id2);
      }
      /* collect data from socket */
      for (let i = 0; i < data.length; i++) {
        /* if TX pointer is full, reset TX */
        if (node.txp == TXBUFFLEN) {
          node.tx.fill(0);
          node.txp = 0;
        }
        /* process available data one byte at a time */
        node.tx[node.txp++] = data[i];
        /* process transaction data as a whole transaction */
        if (node.txp == TXBUFFLEN) {
          /* check protocol */
          if (get16(node.tx, TXNETWORKp) != TXNETWORK) {
            return node.socket.destroy('Recv, TXNETWORK protocol violation');
          }
          if (get16(node.tx, TXTRAILERp) != TXEOT) {
            return node.socket.destroy('Recv, TXEOT protocol violation');
          }
          if (get16(node.tx, TXCRC16p) != crc16(node.tx, CRC_COUNT)) {
            return node.socket.destroy('Recv, CRC16 protocol violation');
          }
          if (node.id2 < 0) {
            /* check handshake protocol */
            node.id2 = get16(node.tx, TXID2p);
            if (get16(node.tx, TXOPCODEp) != OP_HELLO_ACK ||
                node.id1 != get16(node.tx, TXID1p)) {
              node.socket.destroy('Recv, Invalid handshake');
            } else {
              /* continue with transaction, opcode */
              prepareTx(node, opcode);
              node.socket.write(node.tx);
              if (Debug) {
                logn('%sSend, %s...', fid, OP_LIST[opcode]);
              }
            }
          } else {
            /* check ids */
            if (get16(node.tx, TXID1p) != node.id1 ||
                get16(node.tx, TXID2p) != node.id2) {
              return node.socket.destroy('Recv, Handshake violation');
            }
            /* check validity of len */
            const len = get16(node.tx, TXLENp);
            if (len > TRANLEN) {
              return node.socket.destroy('Recv, len > TRANLEN');
            }
            /* expand intended data to hold new transaction data */
            const newLength = node.data.byteLength + len;
            node.data = ArrayBuffer.transfer(node.data, newLength);
            for (let j = 0; j < len; j++) {
              node.data[node.datap++] = node.tx[TXSRCADDRp + j];
            }
            /* add node to CurrentPeers */
            addPeer(node.ip, CurrentPeers);
            /* prepare node data for callback */
            switch (node.opcode) {
              case OP_BUSY:
              case OP_NACK:
                node.status = VERROR;
                break;
              default:
                node.status = VEOK;
            } /* end switch (node.opcode ... */
          } /* end if (node.id2 ... else ... */
        } /* end if (node.txp ... */
      } /* end for (let i = 0 ... */
    }); /* end node.socket.on('data' ... */
    node.socket.on('connect', function() {
      if (Debug > 1) {
        logn('%sConnected', fid);
      }
    });
    node.socket.on('timeout', function() {
      if (Debug) {
        error('%sSocket timed out', fid);
      }
      node.status = VETIMEOUT;
      node.socket.destroy();
    });
    node.socket.on('error', function(err) {
      if (Debug) {
        error('%s%s', fid, err.message);
      }
      node.status = VERROR;
    });
    node.socket.on('close', function(err) {
      if (Debug > 1) {
        logn('%sDisconnected', fid);
      }
      if (err) {
        removePeer(node.ip, CurrentPeers);
      }
      node.socket = INVALID_SOCKET;
      node.id2 = (-1);
      curSockets--;
      /* bind resulting node to callback function */
      setTimeout(callback.bind(null, node), 0);
    });
    if (Debug > 1) {
      logn('%sConnecting...', fid);
    }
    node.socket.setTimeout(3000);
    node.socket.setKeepAlive(true);
    node.socket.setNoDelay(true);
    node.socket.connect(dstPort, node.ip);
    node.called = Date.now();
    return VEOK;
  };
  /**
   * Decode Mochimo Node information from it's Transaction Data.
   * @param {external:Uint8Array} tx Transaction Data from a Node
   * @return {external:NodeInfo} An object containing Mochimo Node information
   * @example
   * const nodeInfo = MochimoCore.decodeInfo(node.tx);
   * console.log('decodeInfo() returned:\n%j', nodeInfo);
   *
   * /* OUTPUT
   * decodeInfo() returned:
   * { "version": 4, "cbits": 1, "network": ... }
   */
  this.decodeInfo = function(tx) {
    const info = {};
    /* set simple byte fields */
    info.version = node.tx[TXVERSIONp];
    info.cbits = node.tx[TXVERSIONp + 1];
    info.network = get16(node.tx, TXNETWORKp);
    info.opcode = get16(node.tx, TXOPCODEp);
    /* prepare complex byte fields */
    info.bnum = new Uint8Array(8);
    info.cbnum = new Uint8Array(8);
    info.chash = new Uint8Array(32);
    info.phash = new Uint8Array(32);
    info.weight = new Uint8Array(32);
    info.peers = [];
    /* set complex byte fields */
    memcpy(info.bnum, node.tx, 8, TXBLOCKNUMp);
    memcpy(info.cbnum, node.tx, 8, TXCBLOCKp);
    memcpy(info.chash, node.tx, 32, TXCBLOCKHASHp);
    memcpy(info.phash, node.tx, 32, TXPBLOCKHASHp);
    memcpy(info.weight, node.tx, 32, TXWEIGHTp);

    return info;
  };
  /**
   * Build a fresh map of the Mochimo Network by updating the peer lists of all
   * available (non-busy) nodes on the network.<br>**Note:** If a second call to
   * mapNetwork is made before the first one finishes, the first callback will
   * be overwritten by the second.
   * @param {external:Function} callback The callback that handles the
   * final array of active nodes. Called after the map has been finalised.
   * @param {external:String} startPeer (Optional) Add peers to RecentPeers
   * before building the network map.
   * @param {external:Boolean} reset (Optional) Clear RecentPeers list before
   * building network map. For clearing inactive RecentPeers.
   * @return {external:Number} Core status indicating the success of the
   * function
   * @example
   * MochimoCore.mapNetwork(function(ipl) {
   *   console.log('mapNetwork returned %d IPs:\n%j', ipl.length, ipl);
   * }, '127.0.0.1');
   *
   * /* OUTPUT:
   * mapNetwork returned 54 IPs:
   * ["34.94.69.50","184.166.146.67","35.197.180.194","164.68.101.85",...]
   */
  this.mapNetwork = function(callback, startPeer, reset) {
    const fid = 'Core.mapNetwork()-> ';
    /* intial map reset */
    if (Mstopwatch === VEOK) {
      Mstopwatch = Date.now();
      if (reset) {
        RecentPeers.length = 0;
        RecentPeers = CurrentPeers.slice(0);
      }
      CurrentPeers.length = 0;
      Mapping.length = 0;
      Mapped.length = 0;
    }
    /* add start peers, if any */
    if (typeof startPeer !== 'undefined') {
      addPeer(startPeer, RecentPeers);
    }
    /* check scanability */
    const len = RecentPeers.length;
    if (len == 0) {
      error('%sNo start nodes. Try adding an active startPeer', fid);
      return VERROR;
    }
    /* attempt map of entire RecentPeers list */
    let i = 0;
    let peer = null;
    for (; i < len; i ++) {
      peer = RecentPeers[i];
      /* check if peer is done or in progress */
      if (Mapped.indexOf(peer) == (-1) && Mapping.indexOf(peer) == (-1)) {
        if (self.callserver(mapNetworkResult, peer, OP_GETIPL) == VEOK) {
          /* callserver success, add to 'in progress' */
          Mapping.push(peer);
        } else {
          /* callserver unavailable, break for timeout retry */
          break;
        }
      }
    }
    /* if RecentPeers scan incomplete or nodes 'in progress'... */
    if (i < len || Mapping.length) {
      /* ... schedule a mapNetwork() retry */
      clearTimeout(Mtimeout);
      Mtimeout = setTimeout(self.mapNetwork.bind(null, callback), Corems);
    } else if (callback) {
      /* ... otherwise finish and bind CurrentPeers with callback */
      if (Debug) {
        logn('%s%dms, Current: %d, Recent: %d', fid, Date.now() - Mstopwatch,
            CurrentPeers.length, RecentPeers.length);
      }
      setTimeout(callback.bind(null, CurrentPeers), 0);
      Mtimeout = null;
      Mstopwatch = VEOK;
    }
    return VEOK;
  };
  /**
   * Get a list of current/active peers on the network.
   * @return {external:String[]} A duplicate of CurrentPeers
   */
  this.getCurrentPeers = function() {
    return CurrentPeers.slice(0);
  };
  /**
   * Get a list of recent/all peers on the network.
   * @return {external:String[]} A duplicate of RecentPeers
   */
  this.getRecentPeers = function() {
    return RecentPeers.slice(0);
  };
  /**
   * Set the compatibility bits of this instance.
   * @param {external:Number} bits The 8 bit decimal formation of compatibility
   * bits
   * @return {external:Number} Status indicating the success of the function
   */
  this.setCbits = function(bits) {
    const fid = util.format('Core.setCbits(%d)-> ', bits);
    /* force integer value */
    bits = parseInt(bits, 10);
    /* check input is valid */
    if (setNumberCheck(fid, bits, 0) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    Cbits = bits;
    return VEOK;
  };
  /**
   * Set the delay between Core callbacks and looping functions.
   * @param {external:Number} ms Time in milliseconds
   * @return {external:Number} Status indicating the success of the function
   */
  this.setCorems = function(ms) {
    const fid = util.format('Core.setCorems(%d)-> ', ms);
    /* force integer value */
    ms = parseInt(ms, 10);
    /* check input is valid */
    if (setNumberCheck(fid, ms, 0) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    Corems = ms;
    return VEOK;
  };
  /**
   * Set the Core console output verbosity for debugging.
   * @param {external:Number} val Debug value of verbosity
   * @return {external:Number} Status indicating the success of the function
   */
  this.setDebug = function(val) {
    const fid = util.format('Core.setDebug(%d)-> ', val);
    /* force integer value */
    val = parseInt(val, 10);
    /* check input is valid */
    if (setNumberCheck(fid, val, 0, 3) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    Debug = val;
    return VEOK;
  };
  /**
   * Set the maximum concurrent sockets the Core can use at any one time.
   * @param {external:Number} max Maximum number of concurrent sockets
   * @return {external:Number} Status indicating the success of the function
   */
  this.setMaxSockets = function(max) {
    const fid = util.format('Core.setMaxSockets(%d)-> ', max);
    /* force integer value */
    max = parseInt(max, 10);
    /* check input is valid */
    if (setNumberCheck(fid, max, 1, 255) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    maxSockets = max;
    return VEOK;
  };
  /**
   * Set the destination port used to connect to the Mochimo Network.
   * @param {external:Number} port Socket destination port
   * @return {external:Number} Status indicating the success of the function
   */
  this.setPort = function(port) {
    const fid = util.format('Core.setPort(%d)-> ', port);
    /* force integer value */
    port = parseInt(port, 10);
    /* check input is valid */
    if (setNumberCheck(fid, port, 1, 65535) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    dstPort = port;
    return VEOK;
  };
  /**
   * Set the protocol version used to connect to the Mochimo Network. If there
   * has been a protocol update (hard fork) this must be used to set the
   * appropriate protocol version, otherwise you connection to the Mochimo
   * Network may be rejected.
   * @param {external:Number} version Mochimo Protocol Version
   * @return {external:Number} Status indicating the success of the function
   */
  this.setPversion = function(version) {
    const fid = util.format('Core.setPversion(%d)-> ', version);
    /* force integer value */
    version = parseInt(version, 10);
    /* check input is valid */
    if (setNumberCheck(fid, version, 0) != VEOK) {
      return VERROR;
    }
    /* set local setting */
    Pversion = version;
    return VEOK;
  };
} /* end Function Core ... */


module.exports = {
  /* modules */
  Core,
  /* return status' */
  VEOK, VERROR, VEBAD, VETIMEOUT,
  /* opcodes */
  OP_NULL, OP_HELLO, OP_HELLO_ACK, OP_TX, OP_FOUND, OP_GETBLOCK, OP_GETIPL,
  OP_SEND_BL, OP_SEND_IP, OP_BUSY, OP_NACK, OP_GET_TFILE, OP_BALANCE, OP_TF,
  OP_SEND_BAL, OP_RESOLVE, OP_GET_CBLOCK, OP_MBLOCK, OP_HASH, OP_IDENTIFY,
};
