
/* global BigInt */

/* requirements */
const { LOG, ntoa, Socket } = require('./util.js');
const { rand16 } = require('./rand.js');
const Tx = require('./tx.js');
const {
  HASHLEN, TRANLEN, TXNETWORK, TXEOT,
  INVALID_SOCKET, VEREJECTED, VETIMEOUT, VEOK, VERROR, VEBAD,
  OP_NULL, OP_HELLO, OP_HELLO_ACK, OP_TX, OP_BUSY, OP_NACK, OP_SEND_IP,
  FIRST_OP, LAST_OP, OP_TEXT,
  TXSRCADDRp
} = require('./constants.js');

/* Private Variables */
const Default = {
  timeout: 10000,
  pversion: 4,
  port: 2095,
  cbits: 0,
  cblocknum: BigInt(0),
  cblockhash: new Uint8Array(HASHLEN),
  pblockhash: new Uint8Array(HASHLEN),
  weight: new Uint8Array(HASHLEN)
};

/**
 * @typicalname node
 * @classdesc The Node class is primarily used to communicate with network peers
 * connected to the Mochimo Cryptocurrency Network.
 * @property {external:String} ip The IPv4 address used in the peer connection
 * @property {external:Number} port The port number used in the peer connection
 * @property {external:Number} ping The ping (in ms) associated with the peer
 * connection's response to an OP_HELLO request
 * @property {external:Number} baud The baudrate (in bits per sec) associated
 * with the peer connection
 * @property {external:Number} status The status of the peer
 * @property {external:Number} id1 3-way handshake verification ID #1
 * @property {external:Number} id2 3-way handshake verification ID #2
 * @property {external:Number} opcode Operation code transmitted in tx
 * @property {external:Tx} tx The last transaction packet received from a peer
 * @property {external:Socket} socket A Socket object that handles communication
 * with the peer
 * @property {external:Uint8Array} data The transaction buffer data
 * @property {external:Number} lastTouch UTC Timestamp (in ms), updated on Node
 * creation, after Socket connection and on Socket data event */
class Node {
  /**
   * *FOR ADVANCED USE ONLY!*<br>Although the Node class *can* be instantiated
   * directly, it is **not recommended.**<br>Instead, consider using the static
   * function {@link Node.callserver} to obtain a Node object.
   * @param {external:String} [options={}] ...see Node.callserver([options]) */
  constructor (options = {}) {
    this.ip = options.ip || '0.0.0.0';
    this.port = options.port || Default.port;
    this.lastTouch = Date.now();
    this.status = VEREJECTED;
    this.ping = 0;
    this.baud = 0;
    this.id1 = 0;
    this.id2 = -1;
    this.opcode = OP_NULL;
    this.tx = new Tx();
    this.socket = new Socket();
    this.data = null;
  }

  /**
   *
   * @property {external:String} ip *refer to Node class properties*
   * @property {external:Number} port
   * @property {external:Number} status
   * @property {external:Number} lastTouch
   * @property {external:Number} ping *present if status is `VEOK` or `VEBAD`*
   * @property {external:Number} baud *present if status is `VEOK` or `VEBAD`*
   * @property {external:Object} tx  *present if status is `VEOK` or `VEBAD`*
   * <br>... see {@link Tx.toJSON}, excluding properties: `id1`, `id2`,
   * `opcode`, `len`, `srcaddr`, `dstaddr`, `chgaddr`, `sendtotal`,
   * `changetotal`, `txfee`, `txsig`, `crc16`, `trailer`, `data`
   * @property {Array.<external:String>} peers *present if status is `VEOK` and
   * tx.opcode is `OP_SEND_IP`*<br>Array of peers requested with `OP_GETIPL`
   * @return {external:Object} Node class object, in JSON format */
  toJSON () {
    const { ip, port, lastTouch, status } = this;
    const json = { ip, port, lastTouch, status };
    // include more details for following node statuses
    const statusMore = [VEOK, VEBAD];
    if (statusMore.includes(this.status)) {
      // get socket statistics
      const { ping, baud } = this;
      Object.json(json, { ping, baud });
      // get network and blockchain details from tx
      const txJSON = this.tx.toJSON();
      const { pversion, cbits, network } = txJSON;
      const { cblock, cblockhash, pblockhash, weight } = txJSON;
      const moreNet = { pversion, cbits, network };
      const moreBc = { cblock, cblockhash, pblockhash, weight };
      Object.assign(json, moreNet, moreBc);
      // get peer details on OP_SEND_IP, if status is VEOK
      if (this.status === VEOK && this.tx.opcode === OP_SEND_IP) {
        const peers = [];
        // iterate peer data from tx
        const len = this.data.byteLength;
        const dataView = new DataView(this.data.buffer);
        for (let i = 0; i < len; i += 4) {
          // get next peer from tx
          peers.push(ntoa(dataView.getUint32(i, true)));
        }
        Object.assign(json, { peers });
      }
    }
    // return detailed node info
    return json;
  }

  /**
   * Connect to a network peer and verify the Mochimo handshake protocol.
   * @param {external:Object} options callserver() options...
   * @param {external:String} options.ip IPv4 address for peer connection
   * @param {external:Number} options.port Port number for peer connection
   * @param {external:Number} options.opcode Operation code to be used upon
   * succesful connection handshake.<br><sup>*Executes sendop() on Node*
   * @param {external:Object} options.tx Object containing Tx parameters to
   * modify before executing sendop() with `options.opcode`.<br><sup>*Does
   * nothing if `options.opcode` is not present*
   * @return {external:Promise}
   * @fulfil {external:Node} A Node object with the result of the connection
   * attempt to a network peer
   * @reject {external:Error} Error indicating a failure to create a Node object
   * or socket connection
   * @example
   * const Mochimo = require('mochimo');
   *
   * Mochimo.Node.callserver('127.0.0.1').then((node) => {
   *   console.log(`Handshake successful, connected to ${node.ip}`);
   * }).catch(console.error); */
  static callserver (options = {}) {
    return new Promise((resolve, reject) => {
      const fid = LOG.debug(`Node.callserver(${JSON.stringify(options)})=>`);
      // initialize transaction variables
      let node = null;
      let txp = 0;
      let ping = 0;
      let startBits = 0;
      let totalBits = 0;
      let totalBytes = 0;
      const transactions = [];
      // attempt Socket allocation with new Node() and increase socket count
      try {
        LOG.debug(fid, 'creating new Node()...');
        node = new Node(options || {});
      } catch (errorReason) {
        LOG.debug(fid, 'failed to create new Node()');
        // reject Promise with Error
        reject(errorReason);
        return;
      }
      // set node Socket event listeners
      node.socket.on('ready', () => {
        LOG.debug(fid, 'socket ready');
        // prepare 3-way handshake
        node.socket.setTimeout(Default.timeout);
        node.opcode = OP_HELLO;
        node.id1 = rand16();
        // send handshake
        Node.sendtx(node);
        // start recording ping
        ping = Date.now();
      });
      node.socket.on('data', (data) => {
        const now = Date.now();
        LOG.debug('%s recv, id1=0x%s id2=0x%s bytes=%d',
          fid, node.id1.toString(16), node.id2.toString(16), data.length);
        // record node ping
        if (node.ping === null) node.ping = now - ping;
        // mark start of bandwidth calculation and count total bytes
        if (startBits === 0) startBits = now;
        totalBits += 8 * data.length;
        // update lastTouch
        node.lastTouch = now;
        // collect data from socket
        for (let i = 0; i < data.length; i++) {
          // process available data one byte at a time
          node.tx[txp++] = data[i];
          // process transaction data as a whole transaction
          if (txp === Tx.length) {
            // reset TX pointer
            txp = 0;
            // check CRC16 hash
            if (!node.tx.crc16test()) {
              LOG.debug('%s %d /= %d(CRC16)',
                fid, node.tx.crc16, node.tx.crc16compute());
              return node.socket.destroy('Invalid CRC16 hash');
            }
            // check Mochimo Network TX protocols
            if (node.tx.network !== TXNETWORK) {
              LOG.debug('%s %d /= %d(TXNETWORK)',
                fid, node.tx.network, TXNETWORK);
              return node.socket.destroy('TXNETWORK protocol violation');
            }
            if (node.tx.trailer !== TXEOT) {
              LOG.debug('%s %d /= %d(TXEOT)', fid, node.tx.trailer, TXEOT);
              return node.socket.destroy('TXEOT protocol violation');
            }
            if (node.id2 < 0) {
              // check handshake protocol
              node.id2 = node.tx.id2;
              if (node.tx.opcode !== OP_HELLO_ACK || node.id1 !== node.tx.id1) {
                node.socket.destroy('Invalid handshake');
              } else {
                // connection verified
                node.status = VEOK;
                // send operation code, otherwise resolve Promise with node
                if (options && options.opcode) {
                  if (options.tx && typeof options.tx === 'object') {
                    for (const [key, value] of Object.entries(options.tx)) {
                      node.tx[key] = value;
                    }
                  }
                  Node.sendop(node, options.opcode).catch(console.error);
                } else resolve(node);
              }
            } else {
              // check ids
              if (node.tx.id1 !== node.id1 || node.tx.id2 !== node.id2) {
                LOG.debug('%s 0x%s /= 0x%s(IDs)', fid,
                  node.tx.id2.toString(16) + node.tx.id1.toString(16),
                  node.id2.toString(16) + node.id1.toString(16));
                return node.socket.destroy('Handshake mutation');
              }
              // check for node operation failure opcodes
              if (node.tx.opcode === OP_BUSY || node.tx.opcode === OP_NACK) {
                node.status = VERROR;
              } else node.status = VEOK;
              // check validity of len
              const len = node.tx.len || 0;
              if (len > TRANLEN) return node.socket.destroy('tx.len > TRANLEN');
              // count received data
              totalBytes += len;
              // add transaction part of Tx to transaction array as Uint8Array
              transactions.push(node.tx.slice(TXSRCADDRp, TXSRCADDRp + len));
            } // end if (node.id2 ... else ...
          } // end if (txp ...
        } // end for (let i = 0 ...
      }); // end node.socket.on('data' ...
      node.socket.on('connect', () => LOG.debug(fid, 'socket connected'));
      node.socket.on('timeout', () => {
        LOG.debug(fid, 'socket timeout');
        node.status = VETIMEOUT;
        node.socket.destroy();
      });
      node.socket.on('error', (error) => {
        LOG.debug(fid, error.message || error);
        node.status = VERROR;
      });
      node.socket.on('close', (error) => {
        const now = Date.now();
        LOG.debug(fid, 'socket disconnected', error ? 'due to error' : '');
        // warn on worst case scenario
        if (node.status === VEREJECTED) {
          LOG.warn(fid, node.ip, 'has rejected your handshake!');
        }
        // invalidate socket and reduce total socket count
        node.socket = INVALID_SOCKET;
        // calculate bandwidth
        node.baud = Math.ceil((totalBits / ((now - startBits) / 1000)));
        // convert node.data to single Uint8Array, or resolve Promise with node
        if (transactions.length) {
          let i = 0;
          let offset = 0;
          node.data = new Uint8Array(totalBytes);
          while (i < transactions.length) {
            node.data.set(transactions[i], offset);
            offset += transactions[i].length;
            i++;
          }
        }
        // reolve Promise with node
        resolve(node);
      });
      // prepare initial socket settings
      node.socket.setTimeout(1000);
      node.socket.setKeepAlive(true);
      node.socket.setNoDelay(true);
      // attempt connection to node on dstPort
      LOG.debug('%s connecting to %s:%d', fid, node.ip, node.port);
      node.socket.connect(node.port, node.ip);
      node.lastTouch = Date.now();
    });
  }

  /**
   * Send an operation code to a connected network peer.
   * @param {external:Node} node Node object with an active socket connection
   * @param {external:Number} opcode Valid operation code
   * @return {external:Promise}
   * @fulfil {external:Node} Reference to the Node object that was passed to the
   * function, updated with the result of the request.
   * @reject {external:Error} Error indicating and invalid operation code or a
   * failure during the requested operation
   * @example
   * const Mochimo = require('mochimo');
   *
   * Mochimo.Node.callserver('127.0.0.1').then((node) => {
   *   console.log(`Handshake successful, connected to ${node.ip}`);
   *   return Mochimo.sendop(node, Mochimo.constants.OP_GETIPL);
   * }).then((node) => {
   *   console.log(`OP_GETIPL operation result: ${node}`);
   * }).catch(console.error); */
  static sendop (node, opcode) {
    return new Promise((resolve, reject) => {
      LOG.debug(`Node.sendop(${node.ip}, ${OP_TEXT[opcode]})=>`);
      // validate opcode
      if (opcode < FIRST_OP || opcode > LAST_OP) {
        // reject Promise with Error
        reject(new Error(`Invalid opcode. Range= ${FIRST_OP}:${LAST_OP}.`));
        return;
      }
      node.socket.on('close', () => {
        // resolve LATEST Promise with node
        resolve(node);
      });
      // send transaction operation, opcode
      node.opcode = opcode;
      Node.sendtx(node);
    });
  }

  /* Mochimo codebase -> call.c, gettx.c, execute.c (JS adaptation) */
  static sendtx (node) {
    const fid = LOG.debug(`Node.sendtx(${node.ip})=>`);
    // prepare transaction buffer
    node.tx.pversion = Default.pversion;
    node.tx.cbits = Default.cbits;
    node.tx.network = TXNETWORK;
    node.tx.id1 = node.id1;
    node.tx.id2 = node.id2;
    node.tx.opcode = node.opcode;
    node.tx.cblock = Default.cblocknum;
    node.tx.cblockhash = Default.cblockhash;
    node.tx.pblockhash = Default.pblockhash;
    if (node.opcode !== OP_TX) {
      node.tx.weight = Default.weight;
    }
    node.tx.crc16 = node.tx.crc16compute();
    node.tx.trailer = TXEOT;
    // send transaction buffer
    LOG.debug('%s sending %s...', fid, OP_TEXT[node.tx.opcode]);
    node.socket.write(node.tx);
  }
}

module.exports = Node;
