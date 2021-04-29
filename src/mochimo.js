
/* requirements */
const { LOG, isPrivateIPv4, ntoa } = require('./util');
const Blockchain = require('./blockchain');
const Constants = require('./constants');
const Trigg = require('./trigg');
const Node = require('./node');
const Wots = require('./wots');
const Tx = require('./tx');

/**
 * @module Mochimo
 * @desc Initialize integration with the Mochimo Cryptocurrency Network.
 * @example
 * const Mochimo = require('mochimo'); */
const Mochimo = {
  /**
   * @function getBalance
   * @desc Download a ledger entry from a network peer.
   * @param {external:String} peer IPv4 address of network peer
   * @param {(external:String|external:Uint8Array)} address A Mochimo WOTS+
   * address or tagged address to search the ledger for.
   * @param {external:Boolean} isTag Indicates that the address is a tag.
   * @returns {external:Promise}
   * @fulfil {?(external:Lentry)} When the address or tag is found, promise
   * resolves a `new Mochimo.Lentry()` object containing the ledger entry data.
   * When the address or tag is NOT found, promise resolves null.
   * @reject {external:Error} Error indicating the failure
   * @example
   * const Mochimo = require('mochimo');
   * const taggedAddress = '696c6c616d616e7564690000';
   *
   * // request ledger entry balance and print results
   * Mochimo.getBalance('127.0.0.1', taggedAddress, true).then(lentry => {
   *   if (lentry === null) console.error('address not found in ledger');
   *   else {
   *     console.log('Full address:', lentry.address);
   *     console.log('Address tag:', lentry.tag);
   *     console.log('Balance:', lentry.balance);
   *   }
   * }).catch(console.error); */
  getBalance: async (peer, address, isTag) => {
    const fid = LOG.verbose(`Mochimo.getBalance(${peer},`,
      `${address.slice(0, 8)}..., ${isTag})=>`);
    const isTyped = address instanceof Uint8Array;
    if (!isTyped && typeof address !== 'string') {
      throw new TypeError('Invalid address type, must be Uint8Array or String');
    } else {
      const maxlen = isTyped ? (isTag ? 12 : 2208) : (isTag ? 24 : 4416);
      if (address.length > maxlen) {
        throw new TypeError(`Invalid address length, must be <= ${maxlen}`);
      }
    }
    const start = Date.now();
    // begin network operation
    const node = await Node.callserver({ ip: peer });
    // check handshake operation status
    if (node.status) {
      LOG.verbose(fid, 'handshake failed with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during handshake`);
    }
    // copy address appropriate position of a controlled Uint8Array
    const addressArray = new Uint8Array(Constants.TXADDRLEN);
    let bytes = isTag ? 2196 : 0;
    if (isTyped) addressArray.set(address, bytes);
    else {
      const maxlen = address.length - 1; // drop half-byte hexadecimals
      for (let i = 0; i < maxlen && bytes < Constants.TXADDRLEN; i += 2) {
        addressArray[bytes++] = parseInt(address.slice(i, i + 2), 16);
      }
    }
    if (isTag) bytes -= 2196; // remove bytes adjusted for tag copy
    // update node tx with buffer length and data, and send operation code
    node.tx.len = bytes;
    if (isTag) {
      node.tx.dstaddr = addressArray;
      LOG.verbose(fid, 'requesting tag address and balance...');
      await Node.sendop(node, Constants.OP_RESOLVE);
    } else {
      node.tx.srcaddr = addressArray;
      LOG.verbose(fid, 'requesting address balance...');
      await Node.sendop(node, Constants.OP_BALANCE);
    }
    // check operation status
    if (node.status) {
      LOG.verbose(fid, 'operation failed with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during operation`);
    } else LOG.verboseT(start, fid, 'balance checked');
    // reconstruct ledger entry from results
    const lentry = new Blockchain.LEntry();
    if (node.tx.opcode === Constants.OP_RESOLVE) {
      if (node.tx.sendtotal === 0n) return null;
      lentry.address = node.tx.dstaddr;
      lentry.balance = node.tx.changetotal;
    } else if (node.tx.opcode === Constants.OP_SEND_BAL) {
      if (node.tx.changetotal === 0n) return null;
      lentry.address = node.tx.srcaddr;
      lentry.balance = node.tx.sendtotal;
    } else {
      LOG.verbose(fid, 'operation returned unexpected opcode:', node.tx.opcode);
      throw new Error(`recv'd unexpected ${Constants.OP_TEXT(node.tx.opcode)}`);
    }
    // return Block object
    return lentry;
  }, // end getBalance() ...
  /**
   * @function getBlock
   * @desc Download a Mochimo Block file from a network peer.
   * @param {external:String} peer IPv4 address of network peer
   * @param {(external:BigInt|external:Number)=} bnum Blockchain number to
   * download<br><sup>Omit parameter to get peer's current block
   * @returns {external:Promise}
   * @fulfil {external:Block} A `new Mochimo.Block()` object containing the
   * downloaded block data
   * @reject {external:Error} Error indicating the failure
   * @example
   * const fsp = require('fs').promises;
   * const Mochimo = require('mochimo');
   *
   * // download and write block data to file, else write error to stderr
   * Mochimo.getBlock('127.0.0.1', 123456).then(block => {
   *   return fsp.writeFile('000000000001e240.bc', block);
   * }).catch(console.error); */
  getBlock: async (peer, bnum) => {
    const fid = LOG.verbose(`Mochimo.getBlock(${peer}, ${bnum})=>`);
    const start = Date.now();
    // begin network operation
    const node = await Node.callserver({ ip: peer });
    // check handshake operation status
    if (node.status) {
      LOG.verbose(fid, 'handshake failed with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during handshake`);
    }
    // set bnum to current block if undefined
    if (typeof bnum === 'undefined') bnum = node.tx.cblock;
    // set I/O blocknumber to bnum
    node.tx.blocknum = bnum;
    // send operation code for block download
    LOG.verbose('%s downloading block 0x%s...', fid, bnum.toString(16));
    await Node.sendop(node, Constants.OP_GETBLOCK);
    // check operation status
    if (node.status) {
      LOG.verbose(fid, 'operation failed with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during operation`);
    } else LOG.verboseT(start, fid, 'download finished');
    // return Block object
    return new Blockchain.Block(node.data);
  }, // end getBlock() ...
  /**
   * @function getNetworkPeers
   * @desc Get a list of available (non-busy) Mochimo Network peers.
   * @param {(Array.<external:String>|external:String)} startPeers Either a
   * single, or an array of, IPv4 addresses to network peers
   * @return {external:Promise}
   * @fulfil {Array.<external:String>} An array of current network peers
   * @reject {external:Error} Error indicating a failure
   * @example
   * const Mochimo = require('mochimo');
   *
   * // get list of peers and write to stdout, else write error to stderr
   * Mochimo.getNetworkPeers('127.0.0.1').then((list) => {
   *   console.log('Found %d Network Peers:\n%O', value.length, value));
   * }).catch(console.error); */
  getNetworkPeers: (startPeers) => {
    return new Promise((resolve, reject) => {
      const fid = LOG.debug(`Mochimo.getNetworkPeers(${startPeers[0]}, ...)=>`);
      const start = Date.now();
      // define unique peer tracking Sets
      const goodPeers = new Set();
      const completedPeers = new Set();
      const connectedPeers = new Set();
      const remainingPeers = new Set();
      const remainingIterator = remainingPeers.values();
      // add starting peer/s to remaining
      if (Array.isArray(startPeers)) remainingPeers.add(...startPeers);
      else remainingPeers.add(startPeers);
      // function to start/continue Mochimo network scan
      const continueScan = (funcDepth) => {
        // ensure max function depth does not exceed 256
        if (funcDepth++ > (1 << 8)) {
          LOG.warn('%sMAX FUNCTION DEPTH EXCEEDED!', fid);
          return;
        }
        // check available sockets for remaining peers
        while (remainingPeers.size) {
          // call next peer in remainingPeers list
          const nextPeer = remainingIterator.next().value;
          remainingPeers.delete(nextPeer);
          connectedPeers.add(nextPeer);
          Node.callserver({ ip: nextPeer }).then((node) => {
            // ignore connections with issues during handshake
            if (node.status) return node;
            // send OP_GETIPL operation code
            return Node.sendop(node, Constants.OP_GETIPL);
          }).then((node) => {
            // add peer to completed list
            completedPeers.add(node.ip);
            // ignore irregular node status
            if (node.status !== Constants.VEOK) {
              LOG.debug(fid, 'ignoring irregular node status');
              return;
            }
            // add peer to good list
            goodPeers.add(node.ip);
            // iterate peer data from tx
            const len = node.data.byteLength;
            const dataView = new DataView(node.data.buffer);
            LOG.verbose('%s %s returned %d peers', fid, node.ip, len / 4);
            for (let i = 0; i < len; i += 4) {
              // get next peer from tx
              const npeer = dataView.getUint32(i, true);
              // skip over private and invalid IPv4 addresses
              if (isPrivateIPv4(npeer)) {
                LOG.debug(
                  '%s ignore private ip %s from %s', fid, ntoa(npeer), node.ip);
                continue;
              }
              // derive IPv4 string from npeer
              const apeer = ntoa(npeer);
              // if peer isn't connected or completed, add to remaining
              if (!connectedPeers.has(apeer) && !completedPeers.has(apeer)) {
                LOG.verbose('%s added %s from %s', fid, apeer, node.ip);
                remainingPeers.add(apeer);
              }
            }
          }).catch(LOG.error).finally(() => { // ignore Promise rejection
            // remove peer from connected
            connectedPeers.delete(nextPeer);
            // check scan completion, otherwise continue scan
            if (!connectedPeers.size && !remainingPeers.size) {
              // record time and resolve Promise with Array from goodPeers
              LOG.infoT(start, fid, 'completed');
              resolve([...completedPeers]);
            } else continueScan(funcDepth);
          });
        }
      };
      // check starting peers exist
      if (!remainingPeers.size) {
        reject(new Error('No starting peers to scan.'));
      } else {
        // begin network scan
        LOG.verbose(fid, 'begin...');
        continueScan();
      }
    });
  }, // end getNetworkPeers() ...
  /**
   * @function getPeerlist
   * @desc Download a peerlist from a network peer.
   * @param {external:String} peer IPv4 address of network peer
   * @return {external:Promise}
   * @fulfil {Array.<external:String>} Array of peers as IPv4 strings
   * @reject {external:Error} Error indicating a failure
   * @example
   * const Mochimo = require('mochimo');
   *
   * // request peerlist from network peer
   * Mochimo.getPeerlist('127.0.0.1').then(peerlist => {
   *   console.log('Peerlist: %O', peerlist);
   * }).catch(console.error); */
  getPeerlist: async (peer) => {
    const fid = LOG.verbose(`Mochimo.getPeerlist(${peer})=>`);
    const start = Date.now();
    // begin network operation
    const node = await Node.callserver({ ip: peer });
    // check handshake operation status
    if (node.status) {
      LOG.verbose(fid, 'handshake failed with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during handshake`);
    }
    // send operation code for peerlist request
    LOG.verbose(fid, 'requesting peerlist...');
    await Node.sendop(node, Constants.OP_GETIPL);
    // check operation status
    if (node.status) {
      LOG.verbose(fid, 'failed operation with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during operation`);
    } else LOG.verboseT(start, fid, 'download finished');
    // extract peerlist data using node.toJSON()
    const peers = node.toJSON().peers;
    // return peerlist data
    return peers;
  }, // end getPeerlist() ...
  /**
   * @function getTfile
   * @desc Download partial or full Trailer file from a network peer.
   * @param {external:String} peer IPv4 address of network peer
   * @param {external:Number=} bnum The first trailer to download (max 32bit
   * number)<br><sup>Omit parameter to download full trailer file (tfile.dat)
   * @param {external:Number=} count The number of trailers to download (max
   * 1000)<br><sup>Omit parameter to download one (1) trailer
   * @return {external:Promise}
   * @fulfil {external:Tfile} A `new Mochimo.Tfile()` object containing the
   * downloaded trailer data
   * @reject {external:Error} Error indicating a failure
   * @example
   * const fsp = require('fs').promises;
   * const Mochimo = require('mochimo');
   *
   * // download and write partial tfile to file, else write error to stderr
   * Mochimo.getTfile('127.0.0.1', 0, 24).then(tfile => {
   *   return fsp.writeFile('partialt_file.dat', tfile);
   * }).catch(console.error); */
  getTfile: async (peer, bnum, count) => {
    const fid = LOG.verbose(`Mochimo.getTfile(${peer}, ${bnum}, ${count})=>`);
    const start = Date.now();
    // begin network operation
    const node = await Node.callserver({ ip: peer });
    // check handshake operation status
    if (node.status) {
      LOG.verbose(fid, 'failed handshake with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during handshake`);
    }
    if (typeof bnum === 'undefined') {
      // send operation code for entire Tfile download
      LOG.verbose(fid, 'downloading Tfile...');
      await Node.sendop(node, Constants.OP_GET_TFILE);
    } else {
      // build 64bit number for partial Tfile download
      if (typeof count === 'undefined') count = 1;
      const buffer = new ArrayBuffer(8);
      const dataview = new DataView(buffer);
      // set first 4 bytes as bnum
      dataview.setUint32(0, bnum, true);
      // set last 4 bytes as count
      dataview.setUint32(4, count, true);
      // set I/O blocknumber as bnum/count dual value
      node.tx.blocknum = dataview.getBigUint64(0, true);
      // send operation code for partial Tfile download
      LOG.verbose(fid, `downloading Tfile.0x${bnum.toString(16)}x${count}...`);
      await Node.sendop(node, Constants.OP_TF);
    }
    // check operation status
    if (node.status) {
      LOG.verbose(fid, 'failed operation with status:', node.status);
      throw new Error(`${Constants.VENAME(node.status)} during operation`);
    } else LOG.verboseT(start, fid, 'download finished');
    // check returned data
    if (node.data.length < Blockchain.BlockTrailer.length) {
      LOG.verbose(fid, 'operation returned unknown data');
      throw new Error('Unknown data from node operation');
    }
    // return partial/full Tfile object
    return new Blockchain.Tfile(node.data);
  }, // end getTfile() ...
  /**
   * Mochimo constants, used throughout the ecosystem of Mochimo protocols.
   * @constant {external:Object} constants
   * @prop {external:Number} INVALID_SOCKET=-1 *Expired/Unused* [Socket](https://nodejs.org/api/net.html#net_class_net_socket)
   * @prop {external:Number} VETIMEOUT=-1 **Return status** for a timeout
   * @prop {external:Number} VEOK=0 **Return status** for no issues
   * @prop {external:Number} VERROR=1 **Return status** for a failure
   * @prop {external:Number} VEBAD=2 **Return status** for a failure and
   * possible malice
   * @prop {external:Number} C_PUSH=1 **Capability bit** indicating the ability
   * to push Candidate Blocks, used primarily by the Mochimo Windows Headless
   * Miner (b00000001)
   * @prop {external:Number} C_WALLET=2 **Capability bit** indicating the
   * operation of a wallet (b00000010)
   * @prop {external:Number} C_SANCTUARY=4 **Capability bit** indicating an
   * activation of the Sanctuary Protocol (b00000100)
   * @prop {external:Number} C_MFEE=8 **Capability bit** indicating the desired
   * Fee change outcome of the Sanctuary Protocol (b00001000)
   * @prop {external:Number} C_LOGGING=16 **Capability bit** indicating the
   * availability of Logging (b00010000)
   * @prop {external:Number} OP_NULL=0 **Operation code** Null; Not used but
   * usually indicating a lack of socket initialization during a transaction of
   * data
   * @prop {external:Number} OP_HELLO=1 **Operation code** Hello; Used as a
   * request code to initiate the first step of a Mochimo 3-way handshake
   * @prop {external:Number} OP_HELLO_ACK=2 **Operation code** Hello
   * Acknowledgement; Used as a return code to indicate the second step of a
   * Mochimo 3-way handshake
   * @prop {external:Number} OP_TX=3 **Operation code** Transaction; Used as
   * request code to send a signed transaction to a Node for distribution across
   * the Mochimo Network
   * @prop {external:Number} OP_FOUND=4 **Operation code** Block Found; Used as
   * a network alert code indicating the existence of a new block update
   * available for download. To obtain the block update, a new socket connection
   * and opcode must be used
   * @prop {external:Number} OP_GETBLOCK=5 **Operation code** Get Block; Used as
   * a request code to get/download a block from a Node. This operation can take
   * some time if requesting a neogensis block, due to network speed and ledger
   * file size
   * @prop {external:Number} OP_GETIPL=6 **Operation code** Get IP List; Used as
   * a request code when requesting a Node's peer list
   * @prop {external:Number} OP_SEND_BL=7 **Operation code** Send Block; Used as
   * a return code for validation when sending a block, usually after an
   * OP_GETBLOCK is received
   * @prop {external:Number} OP_SEND_IP=8 **Operation code** Send IP List; Used
   * as a validation code when sending a peer list, usually after an OP_GETIPL
   * is received
   * @prop {external:Number} OP_BUSY=9 **Operation code** Busy; Used as a return
   * code to indicate that a Node is currently busy and unable to process a
   * request
   * @prop {external:Number} OP_NACK=10 **Operation code** No Acknowledgement
   * operation code? The workings of this code is currently unknown, as it is
   * unused throughout the codebase. I'm sure if I was to ask of it's original
   * purpose I would get a clear and concise response. For now, this obnoxiously
   * unhelpful description will serve as one of my adequate systems of unusual
   * humor
   * @prop {external:Number} OP_GET_TFILE=11 **Operation code** Get Trailer
   * File; Used as a request code to get/download a Node's entire Tfile. This
   * operation can take some time, due to network speed and Tfile size
   * @prop {external:Number} OP_BALANCE=12 **Operation code** Address Balance;
   * Used as a request code when requesting the balance of a Mochimo Address
   * @prop {external:Number} OP_SEND_BAL=13 **Operation code** Send Address
   * Balance; Used as a return code for validation when sending the balance of a
   * Mochimo Address
   * @prop {external:Number} OP_RESOLVE=14 **Operation code** Resolve Tag; Used
   * as a request/return code when requesting the Mochimo Address registered to
   * a Mochimo Tag
   * @prop {external:Number} OP_GET_CBLOCK=15 **Operation code** Get Candidate
   * Block; Used as a request code to get/download a candidate block from a
   * Node. Candidate blocks include all recent transactions for a Windows
   * Headless Miner to find a solution
   * @prop {external:Number} OP_MBLOCK=16 **Operation code** Mined Block; Used
   * as a network alert code indicating that a Windows Headless Miner has found
   * a solution to a candidate block it received and requires assistance
   * distributing the block update. Unlike OP_FOUND, the socket connection stays
   * open to continue sending the block update along with OP_SEND_BL
   * @prop {external:Number} OP_HASH=17 **Operation code** Block Hash; Used as a
   * request/return code when requesting the block hash of a specified block
   * number
   * @prop {external:Number} OP_TF=18 **Operation code** Partial Trailer File;
   * Used as a request code to get/download a section of a Trailer File.
   * Requests can be up to 1000 trailers in size, and the operation is validated
   * with an OP_SEND_BL return code
   * @prop {external:Number} OP_IDENTIFY=19 **Operation code** Identify; Used as
   * a request/return code to identify which nodes have activated the Sanctuary
   * protocol and obtain their Santuary specifications
   * @example
   * const Mochimo = require('mochimo');
   * console.log(`The value of VEOK is available at ${Mochimo.constants.VEOK}`);
   * console.log(`... and is also available at ${Mochimo.VEOK}`); */
  constants: Constants,
  Trigg,
  Node,
  Wots,
  Tx
}; // end const Mochimo...

/********************************************************************/
/* Expose classes and constants on Mochimo module.exports via Proxy */
module.exports = new Proxy(Mochimo, {
  get (target, property, receiver) {
    if (typeof Constants[property] !== 'undefined') {
      return Constants[property];
    } else if (typeof Blockchain[property] !== 'undefined') {
      return Blockchain[property];
    } else return Reflect.get(target, property, receiver);
  }
});

/************************************/
/* Display succesful initialization */
LOG.verbose('Mochimo Module v0.3.0 succesfully initialized!');

/**
 * @external Boolean
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type */
/**
 * @external String
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type */
/**
 * @external Number
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type */
/**
 * @external BigInt
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt */
/**
 * @external Object
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects */
/**
 * @external Function
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions */
/**
 * @external Array
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array */
/**
 * @external Buffer
 * @see https://nodejs.org/api/buffer.html */
/**
 * @external TypedArray
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray */
/**
 * @external ArrayBuffer
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer */
/**
 * @external Uint8Array
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array */
/**
 * @external Promise
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise */
/**
 * @external Socket
 * @see https://nodejs.org/api/net.html#net_class_net_socket */
/**
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error */
/**
 * @external LEntry
 * @see #LEntry */
/**
 * @external TXReference
 * @see #TXReference */
/**
 * @external TXEntry
 * @see #TXEntry */
/**
 * @external BlockTrailer
 * @see #BlockTrailer */
/**
 * @external Block
 * @see #Block */
/**
 * @external Tfile
 * @see #Tfile */
/**
 * @external Tx
 * @see #Tx */
/**
 * @external Node
 * @see #Node */
