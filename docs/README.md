# Documentation
[![npm](https://img.shields.io/static/v1?label=npm&message=v0.3.2&color=orange)](https://www.npmjs.com/package/mochimo/v/0.3.2)
[![chrisdigity](https://img.shields.io/static/v1?label=%C2%A9%202019-2021&message=Chrisdigity&color=blue&style=plastic)](https://github.com/chrisdigity)

## Before you begin...
You might want to familiarise yourself with some Mochimo codebase *lingo*...

**Transaction Buffer**<br>
The entire TX object used for communication between nodes

**Transaction Data**<br>
The data contained within the Transaction Buffer (usually a Network Transaction)

**Capability Bits**<br>
The bits of a byte after the version byte of a transaction buffer, indicating a
Node's capabilities on the network

**Operation Codes**<br>
Number codes used during socket connection to request certain operations with
the Mochimo Network

**Transaction Address**<br>
The full quantum resistant address used by the Mochimo Cryptocurrency Network

**Source/Destination/Change Addresses**<br>
Due to the security concern of using "One Time Signatures" (see WOTS+), a
standard transaction consists of 3 addressable parts:
 - The source address; the address where funds are transferred from,
 - The destination address; the address where funds are transferred to (the
amount of funds that are transferred to this address is determined by the value
of an associated "sendtotal" property), and
 - The change address; the address where the remaining funds that weren't sent
to the destination address are received (the amount of funds that are
transferred to this address is determined by the value of an associated
"changetotal" property)

With that out of the way, let's begin...

## Modules

<dl>
<dt><a href="#module_Mochimo">Mochimo</a></dt>
<dd><p>Initialize integration with the Mochimo Cryptocurrency Network.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#LEntry">LEntry</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p><em>LEntry class objects are only accessible via the <a href="#Block">Block</a>
class.</em><br>The Ledger Entry class is a Uint8Array of static size containing
a full WOTS+ address and a 64-bit balance.</p>
</dd>
<dt><a href="#TXEntry">TXEntry</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p><em>TXEntry class objects are only accessible via the <a href="#Block">Block</a>
class.</em><br>The Transaction class is a Uint8Array of static size containing
all elements required for inclusion in a valid Mochimo Block or TX Object.
TXEntry is typically used for reading transactions from a Mochimo Block.</p>
</dd>
<dt><a href="#BlockTrailer">BlockTrailer</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p>The BlockTrailer class is a Uint8Array of static size containing
the trailer elements appended to a valid Mochimo Block. BlockTrailers can be
joined together in series to create a historically verifiable chain known as
a <a href="#Tfile">Tfile</a>.</p>
</dd>
<dt><a href="#Block">Block</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p>The Block class is a Uint8Array consisting of 3 main parts; a
block header, block contents, and a block trailer. The contents of a block
can be either transactions (for a normal block), ledger entries (for a
neogenesis block), or empty (for a pseudo block).</p>
</dd>
<dt><a href="#Tfile">Tfile</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p>The Tfile class is a Uint8Array desgined to contain all or part of
the historically verifiable chain known as a Tfile in the Mochimo ecosystem.</p>
</dd>
<dt><a href="#Node">Node</a></dt>
<dd><p>The Node class is primarily used to communicate with network peers
connected to the Mochimo Cryptocurrency Network.</p>
</dd>
<dt><a href="#Tx">Tx</a> ⇐ <code><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a></code></dt>
<dd><p>The Tx class is a Uint8Array of static size representing the
Transaction Buffer used to communicate with network peers.</p>
</dd>
<dt><a href="#Wots">Wots</a></dt>
<dd><p>The Wots class provides utility functions to generate, sign and
verify WOTS+ addresses used by the Mochimo Network Blockchain, as well as a
few pointer constants for positions of intra-address components.</p>
</dd>
</dl>

<a name="module_Mochimo"></a>

## Mochimo
Initialize integration with the Mochimo Cryptocurrency Network.

**Example**  
```js
const Mochimo = require('mochimo');
```

* [Mochimo](#module_Mochimo)
    * [~constants](#module_Mochimo..constants) : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * [~getBalance(peer, address, isTag)](#module_Mochimo..getBalance) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~getBlock(peer, [bnum])](#module_Mochimo..getBlock) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~getHash(peer, [bnum])](#module_Mochimo..getHash) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~getNetworkPeers(startPeers)](#module_Mochimo..getNetworkPeers) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~getPeerlist(peer)](#module_Mochimo..getPeerlist) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~getTfile(peer, [bnum], [count])](#module_Mochimo..getTfile) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


* * *

<a name="module_Mochimo..constants"></a>

### Mochimo~constants : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
Mochimo constants, used throughout the ecosystem of Mochimo protocols.

**Kind**: inner constant of [<code>Mochimo</code>](#module_Mochimo)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| INVALID_SOCKET | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>-1</code> | *Expired/Unused* [Socket](https://nodejs.org/api/net.html#net_class_net_socket) |
| VETIMEOUT | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>-1</code> | **Return status** for a timeout |
| VEOK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>0</code> | **Return status** for no issues |
| VERROR | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>1</code> | **Return status** for a failure |
| VEBAD | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>2</code> | **Return status** for a failure and possible malice |
| C_PUSH | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>1</code> | **Capability bit** indicating the ability to push Candidate Blocks, used primarily by the Mochimo Windows Headless Miner (b00000001) |
| C_WALLET | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>2</code> | **Capability bit** indicating the operation of a wallet (b00000010) |
| C_SANCTUARY | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>4</code> | **Capability bit** indicating an activation of the Sanctuary Protocol (b00000100) |
| C_MFEE | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>8</code> | **Capability bit** indicating the desired Fee change outcome of the Sanctuary Protocol (b00001000) |
| C_LOGGING | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>16</code> | **Capability bit** indicating the availability of Logging (b00010000) |
| OP_NULL | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>0</code> | **Operation code** Null; Not used but usually indicating a lack of socket initialization during a transaction of data |
| OP_HELLO | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>1</code> | **Operation code** Hello; Used as a request code to initiate the first step of a Mochimo 3-way handshake |
| OP_HELLO_ACK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>2</code> | **Operation code** Hello Acknowledgement; Used as a return code to indicate the second step of a Mochimo 3-way handshake |
| OP_TX | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>3</code> | **Operation code** Transaction; Used as request code to send a signed transaction to a Node for distribution across the Mochimo Network |
| OP_FOUND | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>4</code> | **Operation code** Block Found; Used as a network alert code indicating the existence of a new block update available for download. To obtain the block update, a new socket connection and opcode must be used |
| OP_GETBLOCK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>5</code> | **Operation code** Get Block; Used as a request code to get/download a block from a Node. This operation can take some time if requesting a neogensis block, due to network speed and ledger file size |
| OP_GETIPL | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>6</code> | **Operation code** Get IP List; Used as a request code when requesting a Node's peer list |
| OP_SEND_BL | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>7</code> | **Operation code** Send Block; Used as a return code for validation when sending a block, usually after an OP_GETBLOCK is received |
| OP_SEND_IP | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>8</code> | **Operation code** Send IP List; Used as a validation code when sending a peer list, usually after an OP_GETIPL is received |
| OP_BUSY | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>9</code> | **Operation code** Busy; Used as a return code to indicate that a Node is currently busy and unable to process a request |
| OP_NACK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>10</code> | **Operation code** No Acknowledgement operation code? The workings of this code is currently unknown, as it is unused throughout the codebase. I'm sure if I was to ask of it's original purpose I would get a clear and concise response. For now, this obnoxiously unhelpful description will serve as one of my adequate systems of unusual humor |
| OP_GET_TFILE | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>11</code> | **Operation code** Get Trailer File; Used as a request code to get/download a Node's entire Tfile. This operation can take some time, due to network speed and Tfile size |
| OP_BALANCE | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>12</code> | **Operation code** Address Balance; Used as a request code when requesting the balance of a Mochimo Address |
| OP_SEND_BAL | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>13</code> | **Operation code** Send Address Balance; Used as a return code for validation when sending the balance of a Mochimo Address |
| OP_RESOLVE | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>14</code> | **Operation code** Resolve Tag; Used as a request/return code when requesting the Mochimo Address registered to a Mochimo Tag |
| OP_GET_CBLOCK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>15</code> | **Operation code** Get Candidate Block; Used as a request code to get/download a candidate block from a Node. Candidate blocks include all recent transactions for a Windows Headless Miner to find a solution |
| OP_MBLOCK | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>16</code> | **Operation code** Mined Block; Used as a network alert code indicating that a Windows Headless Miner has found a solution to a candidate block it received and requires assistance distributing the block update. Unlike OP_FOUND, the socket connection stays open to continue sending the block update along with OP_SEND_BL |
| OP_HASH | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>17</code> | **Operation code** Block Hash; Used as a request/return code when requesting the block hash of a specified block number |
| OP_TF | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>18</code> | **Operation code** Partial Trailer File; Used as a request code to get/download a section of a Trailer File. Requests can be up to 1000 trailers in size, and the operation is validated with an OP_SEND_BL return code |
| OP_IDENTIFY | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | <code>19</code> | **Operation code** Identify; Used as a request/return code to identify which nodes have activated the Sanctuary protocol and obtain their Santuary specifications |

**Example**  
```js
const Mochimo = require('mochimo');console.log(`The value of VEOK is available at ${Mochimo.constants.VEOK}`);console.log(`... and is also available at ${Mochimo.VEOK}`);
```

* * *

<a name="module_Mochimo..getBalance"></a>

### Mochimo~getBalance(peer, address, isTag) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Download a ledger entry from a network peer.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: <code>?(external:Lentry)</code> When the address or tag is found, promiseresolves a `new Mochimo.Lentry()` object containing the ledger entry data.When the address or tag is NOT found, promise resolves null.  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating the failure  

| Param | Type | Description |
| --- | --- | --- |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of network peer |
| address | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) \| [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | A Mochimo WOTS+ address or tagged address to search the ledger for. |
| isTag | [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | Indicates that the address is a tag. |

**Example**  
```js
const Mochimo = require('mochimo');const taggedAddress = '696c6c616d616e7564690000';// request ledger entry balance and print resultsMochimo.getBalance('127.0.0.1', taggedAddress, true).then(lentry => {  if (lentry === null) console.error('address not found in ledger');  else {    console.log('Full address:', lentry.address);    console.log('Address tag:', lentry.tag);    console.log('Balance:', lentry.balance);  }}).catch(console.error);
```

* * *

<a name="module_Mochimo..getBlock"></a>

### Mochimo~getBlock(peer, [bnum]) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Download a Mochimo Block file from a network peer.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: [<code>Block</code>](#Block) A `new Mochimo.Block()` object containing thedownloaded block data  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating the failure  

| Param | Type | Description |
| --- | --- | --- |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of network peer |
| [bnum] | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) \| [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Blockchain number to download<br><sup>Omit parameter to get peer's current block |

**Example**  
```js
const fsp = require('fs').promises;const Mochimo = require('mochimo');// download and write block data to file, else write error to stderrMochimo.getBlock('127.0.0.1', 123456).then(block => {  return fsp.writeFile('000000000001e240.bc', block);}).catch(console.error);
```

* * *

<a name="module_Mochimo..getHash"></a>

### Mochimo~getHash(peer, [bnum]) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Download a Mochimo Block Hash from a network peer.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The block hash represented as a string  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating the failure  

| Param | Type | Description |
| --- | --- | --- |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of network peer |
| [bnum] | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) \| [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Blockchain number of desired hash<br><sup>Omit parameter to get peer's current block |

**Example**  
```js
const Mochimo = require('mochimo');// download and write block data to file, else write error to stderrMochimo.getBlock('127.0.0.1', 0).then(hash => {  console.log('Genesis block hash: ' + hash);}).catch(console.error);
```

* * *

<a name="module_Mochimo..getNetworkPeers"></a>

### Mochimo~getNetworkPeers(startPeers) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get a list of available (non-busy) Mochimo Network peers.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) An array of current network peers  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating a failure  

| Param | Type | Description |
| --- | --- | --- |
| startPeers | [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) \| [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | Either a single, or an array of, IPv4 addresses to network peers |

**Example**  
```js
const Mochimo = require('mochimo');// get list of peers and write to stdout, else write error to stderrMochimo.getNetworkPeers('127.0.0.1').then((list) => {  console.log('Found %d Network Peers:\n%O', value.length, value));}).catch(console.error);
```

* * *

<a name="module_Mochimo..getPeerlist"></a>

### Mochimo~getPeerlist(peer) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Download a peerlist from a network peer.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array of peers as IPv4 strings  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating a failure  

| Param | Type | Description |
| --- | --- | --- |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of network peer |

**Example**  
```js
const Mochimo = require('mochimo');// request peerlist from network peerMochimo.getPeerlist('127.0.0.1').then(peerlist => {  console.log('Peerlist: %O', peerlist);}).catch(console.error);
```

* * *

<a name="module_Mochimo..getTfile"></a>

### Mochimo~getTfile(peer, [bnum], [count]) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Download partial or full Trailer file from a network peer.

**Kind**: inner method of [<code>Mochimo</code>](#module_Mochimo)  
**Fulfil**: [<code>Tfile</code>](#Tfile) A `new Mochimo.Tfile()` object containing thedownloaded trailer data  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating a failure  

| Param | Type | Description |
| --- | --- | --- |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of network peer |
| [bnum] | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The first trailer to download (max 32bit number)<br><sup>Omit parameter to download full trailer file (tfile.dat) |
| [count] | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The number of trailers to download (max 1000)<br><sup>Omit parameter to download one (1) trailer |

**Example**  
```js
const fsp = require('fs').promises;const Mochimo = require('mochimo');// download and write partial tfile to file, else write error to stderrMochimo.getTfile('127.0.0.1', 0, 24).then(tfile => {  return fsp.writeFile('partialt_file.dat', tfile);}).catch(console.error);
```

* * *

<a name="LEntry"></a>

## LEntry ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
*LEntry class objects are only accessible via the [Block](#Block)
class.*<br>The Ledger Entry class is a Uint8Array of static size containing
a full WOTS+ address and a 64-bit balance.

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [LEntry](#LEntry) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * _instance_
        * [.address](#LEntry+address) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.balance](#LEntry+balance) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.tag](#LEntry+tag) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.toJSON()](#LEntry+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * _static_
        * [.length](#LEntry.length) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.ADDRESSp](#LEntry.ADDRESSp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TAGp](#LEntry.TAGp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.BALANCEp](#LEntry.BALANCEp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


* * *

<a name="LEntry+address"></a>

### lentry.address : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The full 2208 byte Mochimo address, in hexadecimal format

**Kind**: instance property of [<code>LEntry</code>](#LEntry)  
**Default**: <code>&quot;0000... &lt;4416 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid data
types are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or
[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>
&ast;Must be 4416 hexadecimal character String or 2208 byte Array.


* * *

<a name="LEntry+balance"></a>

### lentry.balance : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The associated balance, in nanoMochimo

**Kind**: instance property of [<code>LEntry</code>](#LEntry)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="LEntry+tag"></a>

### lentry.tag : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The tag attached to the ledger address, in hexadecimal format

**Kind**: instance property of [<code>LEntry</code>](#LEntry)  
**Default**: <code>&quot;0000... &lt;24 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid data
types are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or
[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>
&ast;Must be 24 hexadecimal character String or 12 byte Array.


* * *

<a name="LEntry+toJSON"></a>

### lentry.toJSON() ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>LEntry</code>](#LEntry)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - LEntry class object, in JSON format  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| address | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to LEntry class properties* |
| balance | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| tag | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |


* * *

<a name="LEntry.length"></a>

### LEntry.length : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Breakdown:
- WOTS+ address, 2208 bytes
- Balance (64bit), 8 bytes

**Kind**: static property of [<code>LEntry</code>](#LEntry)  
**Constant_value**: `2216`  

* * *

<a name="LEntry.ADDRESSp"></a>

### LEntry.ADDRESSp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `address`

**Kind**: static property of [<code>LEntry</code>](#LEntry)  
**Constant_value**: `0`  

* * *

<a name="LEntry.TAGp"></a>

### LEntry.TAGp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `tag`

**Kind**: static property of [<code>LEntry</code>](#LEntry)  
**Constant_value**: `2196`  

* * *

<a name="LEntry.BALANCEp"></a>

### LEntry.BALANCEp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `balance`

**Kind**: static property of [<code>LEntry</code>](#LEntry)  
**Constant_value**: `2208`  

* * *

<a name="TXEntry"></a>

## TXEntry ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
*TXEntry class objects are only accessible via the [Block](#Block)
class.*<br>The Transaction class is a Uint8Array of static size containing
all elements required for inclusion in a valid Mochimo Block or TX Object.
TXEntry is typically used for reading transactions from a Mochimo Block.

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [TXEntry](#TXEntry) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * _instance_
        * [.srcaddr](#TXEntry+srcaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.srctag](#TXEntry+srctag) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.dstaddr](#TXEntry+dstaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.dsttag](#TXEntry+dsttag) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.chgaddr](#TXEntry+chgaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.chgtag](#TXEntry+chgtag) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.sendtotal](#TXEntry+sendtotal) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.changetotal](#TXEntry+changetotal) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.txfee](#TXEntry+txfee) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.txsig](#TXEntry+txsig) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.txid](#TXEntry+txid) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.toJSON(minify)](#TXEntry+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * _static_
        * [.SRCADDRp](#TXEntry.SRCADDRp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.DSTADDRp](#TXEntry.DSTADDRp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.CHGADDRp](#TXEntry.CHGADDRp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.SENDTOTALp](#TXEntry.SENDTOTALp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.CHANGETOTALp](#TXEntry.CHANGETOTALp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TXFEEp](#TXEntry.TXFEEp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TXSIGp](#TXEntry.TXSIGp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TXIDp](#TXEntry.TXIDp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.length](#TXEntry.length) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


* * *

<a name="TXEntry+srcaddr"></a>

### txentry.srcaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The source address, in hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+srctag"></a>

### txentry.srctag : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The tag attached to the source address, in
hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+dstaddr"></a>

### txentry.dstaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The destination address, in hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+dsttag"></a>

### txentry.dsttag : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The tag attached to the destination address, in
hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+chgaddr"></a>

### txentry.chgaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The change address, in hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+chgtag"></a>

### txentry.chgtag : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The tag attached to the change address, in
hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+sendtotal"></a>

### txentry.sendtotal : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The transaction send amount, in nanoMochimo

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+changetotal"></a>

### txentry.changetotal : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The transaction change amount, in nanoMochimo

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+txfee"></a>

### txentry.txfee : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The transaction fee, in nanoMochimo

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+txsig"></a>

### txentry.txsig : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The transaction signature, in hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+txid"></a>

### txentry.txid : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The transaction id, in hexadecimal format

**Kind**: instance property of [<code>TXEntry</code>](#TXEntry)  

* * *

<a name="TXEntry+toJSON"></a>

### txentry.toJSON(minify) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>TXEntry</code>](#TXEntry)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - TXEntry class object, in JSON format  

| Param | Type | Description |
| --- | --- | --- |
| minify | [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | Limits properties to 64 characters long |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| srcaddr | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to TXEntry class properties* |
| srctag | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| dstaddr | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| dsttag | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| chgaddr | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| chgtag | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| sendtotal | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| changetotal | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| txfee | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| txsig | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| txid | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |


* * *

<a name="TXEntry.SRCADDRp"></a>

### TXEntry.SRCADDRp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `srcaddr`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `0`  

* * *

<a name="TXEntry.DSTADDRp"></a>

### TXEntry.DSTADDRp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `dstaddr`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `2208`  

* * *

<a name="TXEntry.CHGADDRp"></a>

### TXEntry.CHGADDRp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `chgaddr`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `4416`  

* * *

<a name="TXEntry.SENDTOTALp"></a>

### TXEntry.SENDTOTALp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `sendtotal`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `6624`  

* * *

<a name="TXEntry.CHANGETOTALp"></a>

### TXEntry.CHANGETOTALp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `changetotal`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `6632`  

* * *

<a name="TXEntry.TXFEEp"></a>

### TXEntry.TXFEEp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `txfee`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `6640`  

* * *

<a name="TXEntry.TXSIGp"></a>

### TXEntry.TXSIGp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `txsig`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `6648`  

* * *

<a name="TXEntry.TXIDp"></a>

### TXEntry.TXIDp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `txid`

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `8792`  

* * *

<a name="TXEntry.length"></a>

### TXEntry.length : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Breakdown:
- 3x WOTS+ (inc. tag), 6624 bytes
- 3x Amounts (64bit), 24 bytes
- 1x Signature (WOTS+), 2144 bytes
- 1x ID Hash (sha256), 32 bytes

**Kind**: static property of [<code>TXEntry</code>](#TXEntry)  
**Constant_value**: `8824`  

* * *

<a name="BlockTrailer"></a>

## BlockTrailer ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
The BlockTrailer class is a Uint8Array of static size containing
the trailer elements appended to a valid Mochimo Block. BlockTrailers can be
joined together in series to create a historically verifiable chain known as
a [Tfile](#Tfile).

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [BlockTrailer](#BlockTrailer) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * _instance_
        * [.phash](#BlockTrailer+phash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.bnum](#BlockTrailer+bnum) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.mfee](#BlockTrailer+mfee) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.tcount](#BlockTrailer+tcount) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.time0](#BlockTrailer+time0) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.difficulty](#BlockTrailer+difficulty) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.mroot](#BlockTrailer+mroot) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.nonce](#BlockTrailer+nonce) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.stime](#BlockTrailer+stime) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.bhash](#BlockTrailer+bhash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.toJSON()](#BlockTrailer+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * _static_
        * [.PHASHp](#BlockTrailer.PHASHp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.BNUMp](#BlockTrailer.BNUMp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.MFEEp](#BlockTrailer.MFEEp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TCOUNTp](#BlockTrailer.TCOUNTp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.TIME0p](#BlockTrailer.TIME0p) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.DIFFp](#BlockTrailer.DIFFp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.MROOTp](#BlockTrailer.MROOTp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.NONCEp](#BlockTrailer.NONCEp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.STIMEp](#BlockTrailer.STIMEp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.BHASHp](#BlockTrailer.BHASHp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.length](#BlockTrailer.length) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


* * *

<a name="BlockTrailer+phash"></a>

### blocktrailer.phash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The previous block hash, in hexadecimal format

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+bnum"></a>

### blocktrailer.bnum : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The block number

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+mfee"></a>

### blocktrailer.mfee : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The mining fee (a.k.a. transaction fee), in
nanoMochimo

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+tcount"></a>

### blocktrailer.tcount : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The number of transactions

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+time0"></a>

### blocktrailer.time0 : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The previous block's solve time (UTC seconds)

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+difficulty"></a>

### blocktrailer.difficulty : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The mining difficulty

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+mroot"></a>

### blocktrailer.mroot : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The merkle root, in hexadecimal format

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+nonce"></a>

### blocktrailer.nonce : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The nonce, in hexadecimal format

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+stime"></a>

### blocktrailer.stime : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The current block's solve time (UTC seconds)

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+bhash"></a>

### blocktrailer.bhash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The current block hash, in hexadecimal format

**Kind**: instance property of [<code>BlockTrailer</code>](#BlockTrailer)  

* * *

<a name="BlockTrailer+toJSON"></a>

### blocktrailer.toJSON() ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>BlockTrailer</code>](#BlockTrailer)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - BlockTrailer class object, in JSON format  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| phash | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to BlockTrailer class properties* |
| bnum | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| mfee | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| tcount | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| time0 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| difficulty | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| mroot | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| nonce | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| stime | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| bhash | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |


* * *

<a name="BlockTrailer.PHASHp"></a>

### BlockTrailer.PHASHp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `phash`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `0`  

* * *

<a name="BlockTrailer.BNUMp"></a>

### BlockTrailer.BNUMp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `bnum`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `32`  

* * *

<a name="BlockTrailer.MFEEp"></a>

### BlockTrailer.MFEEp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `mfee`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `40`  

* * *

<a name="BlockTrailer.TCOUNTp"></a>

### BlockTrailer.TCOUNTp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `tcount`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `48`  

* * *

<a name="BlockTrailer.TIME0p"></a>

### BlockTrailer.TIME0p : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `time0`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `52`  

* * *

<a name="BlockTrailer.DIFFp"></a>

### BlockTrailer.DIFFp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `diff`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `56`  

* * *

<a name="BlockTrailer.MROOTp"></a>

### BlockTrailer.MROOTp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `mroot`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `60`  

* * *

<a name="BlockTrailer.NONCEp"></a>

### BlockTrailer.NONCEp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `nonce`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `92`  

* * *

<a name="BlockTrailer.STIMEp"></a>

### BlockTrailer.STIMEp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `stime`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `124`  

* * *

<a name="BlockTrailer.BHASHp"></a>

### BlockTrailer.BHASHp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
*FOR ADVANCED USE ONLY!*<br>Array pointer to `bhash`

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `128`  

* * *

<a name="BlockTrailer.length"></a>

### BlockTrailer.length : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Breakdown:
- 4x Hash (sha256), 128 bytes
- 2x Number (64-bit), 16 bytes
- 4x Number (32-bit), 16 bytes

**Kind**: static property of [<code>BlockTrailer</code>](#BlockTrailer)  
**Constant_value**: `160`  

* * *

<a name="Block"></a>

## Block ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
The Block class is a Uint8Array consisting of 3 main parts; a
block header, block contents, and a block trailer. The contents of a block
can be either transactions (for a normal block), ledger entries (for a
neogenesis block), or empty (for a pseudo block).

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [Block](#Block) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * _instance_
        * [.type](#Block+type) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.haiku](#Block+haiku) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.amount](#Block+amount) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.hdrlen](#Block+hdrlen) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.maddr](#Block+maddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.mreward](#Block+mreward) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.transactions](#Block+transactions) : [<code>Array.&lt;TXEntry&gt;</code>](#TXEntry)
        * [.ledger](#Block+ledger) : [<code>Array.&lt;LEntry&gt;</code>](#LEntry)
        * [.trailer](#Block+trailer) : [<code>BlockTrailer</code>](#BlockTrailer)
        * [.phash](#Block+phash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.bnum](#Block+bnum) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.mfee](#Block+mfee) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.tcount](#Block+tcount) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.time0](#Block+time0) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.difficulty](#Block+difficulty) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.mroot](#Block+mroot) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.nonce](#Block+nonce) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.stime](#Block+stime) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.bhash](#Block+bhash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.toJSON(minify)](#Block+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
        * [.verifyBlockHash([hash])](#Block+verifyBlockHash) ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    * _static_
        * [.INVALID](#Block.INVALID) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.NORMAL](#Block.NORMAL) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.GENESIS](#Block.GENESIS) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.NEOGENESIS](#Block.NEOGENESIS) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.PSEUDO](#Block.PSEUDO) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


* * *

<a name="Block+type"></a>

### block.type : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The block type

**Kind**: instance property of [<code>Block</code>](#Block)  
**See**

- [INVALID](#Block.INVALID)
- [NORMAL](#Block.NORMAL)
- [GENESIS](#Block.GENESIS)
- [NEOGENESIS](#Block.NEOGENESIS)
- [PSEUDO](#Block.PSEUDO)


* * *

<a name="Block+haiku"></a>

### block.haiku : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The Haiku representation of the blocks nonce.

**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [Block.nonce](Block.nonce)  

* * *

<a name="Block+amount"></a>

### block.amount : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Amount of Mochimo sent in transactions for a [NORMAL](#Block.NORMAL)
block type, or amount of Mochimo stored in ledger entries for a
[NEOGENESIS](#Block.NEOGENESIS) block type.

**Kind**: instance property of [<code>Block</code>](#Block)  

* * *

<a name="Block+hdrlen"></a>

### block.hdrlen : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The block header length

**Kind**: instance property of [<code>Block</code>](#Block)  
**Null**: when size of block buffer is < 4 bytes  

* * *

<a name="Block+maddr"></a>

### block.maddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
The address that receives the mining reward, in hexadecimal format

**Kind**: instance property of [<code>Block</code>](#Block)  
**Null**: when block type !== Block.NORMAL  
**See**: [NORMAL](#Block.NORMAL)  

* * *

<a name="Block+mreward"></a>

### block.mreward : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
The mining reward, in nanoMochimo

**Kind**: instance property of [<code>Block</code>](#Block)  
**Null**: when block type !== Block.NORMAL  
**See**: [NORMAL](#Block.NORMAL)  

* * *

<a name="Block+transactions"></a>

### block.transactions : [<code>Array.&lt;TXEntry&gt;</code>](#TXEntry)
An array of transaction entries contained within the block

**Kind**: instance property of [<code>Block</code>](#Block)  
**Default**: <code>[]</code>  

* * *

<a name="Block+ledger"></a>

### block.ledger : [<code>Array.&lt;LEntry&gt;</code>](#LEntry)
An array of ledger entries contained within the block

**Kind**: instance property of [<code>Block</code>](#Block)  
**Default**: <code>[]</code>  

* * *

<a name="Block+trailer"></a>

### block.trailer : [<code>BlockTrailer</code>](#BlockTrailer)
A BlockTrailer object associated with the block

**Kind**: instance property of [<code>Block</code>](#Block)  

* * *

<a name="Block+phash"></a>

### block.phash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.phash](BlockTrailer.phash)  

* * *

<a name="Block+bnum"></a>

### block.bnum : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.bnum](BlockTrailer.bnum)  

* * *

<a name="Block+mfee"></a>

### block.mfee : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.mfee](BlockTrailer.mfee)  

* * *

<a name="Block+tcount"></a>

### block.tcount : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.tcount](BlockTrailer.tcount)  

* * *

<a name="Block+time0"></a>

### block.time0 : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.time0](BlockTrailer.time0)  

* * *

<a name="Block+difficulty"></a>

### block.difficulty : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.difficulty](BlockTrailer.difficulty)  

* * *

<a name="Block+mroot"></a>

### block.mroot : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.mroot](BlockTrailer.mroot)  

* * *

<a name="Block+nonce"></a>

### block.nonce : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.nonce](BlockTrailer.nonce)  

* * *

<a name="Block+stime"></a>

### block.stime : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.stime](BlockTrailer.stime)  

* * *

<a name="Block+bhash"></a>

### block.bhash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
**Kind**: instance property of [<code>Block</code>](#Block)  
**See**: [BlockTrailer.bhash](BlockTrailer.bhash)  

* * *

<a name="Block+toJSON"></a>

### block.toJSON(minify) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>Block</code>](#Block)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - Block class object, in JSON format  

| Param | Type | Description |
| --- | --- | --- |
| minify | [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | Limits string properties to 64 characters and removes transactions/ledger array. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The block type *as a string* |
| size | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The size of the Block in bytes |
| bnum | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to Block class properties* |
| time0 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| stime | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| difficulty | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| bhash | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| phash | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| mroot | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| nonce | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| maddr | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| mreward | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| mfee | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| amount | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL, GENESIS and NEOGENESIS block types* |
| tcount | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| transactions | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on NORMAL block types* |
| lcount | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on GENESIS and NEOGENESIS block types* |
| ledger | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *Only available on GENESIS and NEOGENESIS block types |


* * *

<a name="Block+verifyBlockHash"></a>

### block.verifyBlockHash([hash]) ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
Verify the block hash contained within a Block object.

**Kind**: instance method of [<code>Block</code>](#Block)  
**Returns**: [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) - Verified status of block hash  

| Param | Type | Description |
| --- | --- | --- |
| [hash] | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | Optional hash to verify against |


* * *

<a name="Block.INVALID"></a>

### Block.INVALID : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Represents an invalid block type

**Kind**: static property of [<code>Block</code>](#Block)  
**Constant_value**: `"invalid"`  

* * *

<a name="Block.NORMAL"></a>

### Block.NORMAL : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Represents a normal block type

**Kind**: static property of [<code>Block</code>](#Block)  
**Constant_value**: `"normal"`  

* * *

<a name="Block.GENESIS"></a>

### Block.GENESIS : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Represents a genesis block type

**Kind**: static property of [<code>Block</code>](#Block)  
**Constant_value**: `"genesis"`  

* * *

<a name="Block.NEOGENESIS"></a>

### Block.NEOGENESIS : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Represents a neogenesis block type

**Kind**: static property of [<code>Block</code>](#Block)  
**Constant_value**: `"neogenesis"`  

* * *

<a name="Block.PSEUDO"></a>

### Block.PSEUDO : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Represents a pseudo block type

**Kind**: static property of [<code>Block</code>](#Block)  
**Constant_value**: `"pseudo"`  

* * *

<a name="Tfile"></a>

## Tfile ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
The Tfile class is a Uint8Array desgined to contain all or part of
the historically verifiable chain known as a Tfile in the Mochimo ecosystem.

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [Tfile](#Tfile) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * [new Tfile(bytes, [offset], [length])](#new_Tfile_new)
    * [.trailer(index)](#Tfile+trailer) ⇒ [<code>BlockTrailer</code>](#BlockTrailer)


* * *

<a name="new_Tfile_new"></a>

### new Tfile(bytes, [offset], [length])
*FOR ADVANCED USE ONLY!*<br>Although the Tfile class *can* be instantiated
directly, it is **not recommended.**<br>Instead, consider using
[Mochimo.getTfile()](#module_Mochimo..getTfile) to obtain a Tfile
directly from the Mochimo network.


| Param | Type | Description |
| --- | --- | --- |
| bytes | [<code>ArrayBuffer</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) \| [<code>TypedArray</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | Tfile data |
| [offset] | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The starting byte of the exposed data |
| [length] | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The length of the exposed data<br><sup>The length will be modified if not a multiple of BlockTrailer.length (160) |


* * *

<a name="Tfile+trailer"></a>

### tfile.trailer(index) ⇒ [<code>BlockTrailer</code>](#BlockTrailer)
**Kind**: instance method of [<code>Tfile</code>](#Tfile)  
**Returns**: [<code>BlockTrailer</code>](#BlockTrailer) - A BlockTrailer object representing trailer
data at the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| index | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Index of desired block trailer |


* * *

<a name="Node"></a>

## Node
The Node class is primarily used to communicate with network peersconnected to the Mochimo Cryptocurrency Network.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timestamp | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | UTC Timestamp (in ms), updated on Node creation, after Socket connection and on Socket data event |
| ip | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | The IPv4 address used in the peer connection |
| port | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The port number used in the peer connection |
| ping | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The ping (in ms) associated with the peer connection's response to an OP_HELLO request |
| baud | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The baudrate (in bits per sec) associated with the peer connection |
| status | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The status of the peer |
| id1 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | 3-way handshake verification ID #1 |
| id2 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | 3-way handshake verification ID #2 |
| opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Operation code transmitted in tx |
| tx | [<code>Tx</code>](#Tx) | The last transaction packet received from a peer |
| socket | [<code>Socket</code>](https://nodejs.org/api/net.html#net_class_net_socket) | A Socket object that handles communication with the peer |
| data | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The transaction buffer data |


* [Node](#Node)
    * [new Node([options])](#new_Node_new)
    * _instance_
        * [.toJSON()](#Node+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * _static_
        * [.callserver(options)](#Node.callserver) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [.sendop(node, opcode)](#Node.sendop) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


* * *

<a name="new_Node_new"></a>

### new Node([options])
*FOR ADVANCED USE ONLY!*<br>Although the Node class *can* be instantiateddirectly, it is **not recommended.**<br>Instead, consider using the staticfunction [callserver](#Node.callserver) to obtain a Node object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | <code>{}</code> | ...see Node.callserver([options]) |


* * *

<a name="Node+toJSON"></a>

### node.toJSON() ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>Node</code>](#Node)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - Node class object, in JSON format  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timestamp | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| ip | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | *refer to Node class properties* |
| port | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| status | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| ping | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *present if status is `VEOK` or `VEBAD`* |
| baud | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *present if status is `VEOK` or `VEBAD`* |
| pversion | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to Tx class properties* |
| cbits | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| network | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| cblock | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |  |
| cblockhash | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| pblockhash | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| weight | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| peers | [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | *present if status is `VEOK` and tx.opcode wass `OP_SEND_IP`*<br>Array of peers requested with `OP_GETIPL` |


* * *

<a name="Node.callserver"></a>

### Node.callserver(options) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Connect to a network peer and verify the Mochimo handshake protocol.

**Kind**: static method of [<code>Node</code>](#Node)  
**Fulfil**: [<code>Node</code>](#Node) A Node object with the result of the connectionattempt to a network peer  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating a failure to create a Node objector socket connection  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) | callserver() options... |
| options.ip | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address for peer connection |
| options.port | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Port number for peer connection |
| options.opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Operation code to be used upon succesful connection handshake.<br><sup>*Executes sendop() on Node* |
| options.tx | [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) | Object containing Tx parameters to modify before executing sendop() with `options.opcode`.<br><sup>*Does nothing if `options.opcode` is not present* |

**Example**  
```js
const Mochimo = require('mochimo');Mochimo.Node.callserver('127.0.0.1').then((node) => {  console.log(`Handshake successful, connected to ${node.ip}`);}).catch(console.error);
```

* * *

<a name="Node.sendop"></a>

### Node.sendop(node, opcode) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Send an operation code to a connected network peer.

**Kind**: static method of [<code>Node</code>](#Node)  
**Fulfil**: [<code>Node</code>](#Node) Reference to the Node object that was passed to thefunction, updated with the result of the request.  
**Reject**: [<code>Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Error indicating and invalid operation code or afailure during the requested operation  

| Param | Type | Description |
| --- | --- | --- |
| node | [<code>Node</code>](#Node) | Node object with an active socket connection |
| opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Valid operation code |

**Example**  
```js
const Mochimo = require('mochimo');Mochimo.Node.callserver('127.0.0.1').then((node) => {  console.log(`Handshake successful, connected to ${node.ip}`);  return Mochimo.sendop(node, Mochimo.constants.OP_GETIPL);}).then((node) => {  console.log(`OP_GETIPL operation result: ${node}`);}).catch(console.error);
```

* * *

<a name="Tx"></a>

## Tx ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
The Tx class is a Uint8Array of static size representing theTransaction Buffer used to communicate with network peers.

**Kind**: global class  
**Extends**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)  

* [Tx](#Tx) ⇐ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * [new Tx()](#new_Tx_new)
    * _instance_
        * [.blocknum](#Tx+blocknum) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.cbits](#Tx+cbits) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.cblock](#Tx+cblock) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.cblockhash](#Tx+cblockhash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.changetotal](#Tx+changetotal) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.chgaddr](#Tx+chgaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.crc16](#Tx+crc16) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.dstaddr](#Tx+dstaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.id1](#Tx+id1) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.id2](#Tx+id2) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.len](#Tx+len) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.network](#Tx+network) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.opcode](#Tx+opcode) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.pblockhash](#Tx+pblockhash) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.pversion](#Tx+pversion) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.sendtotal](#Tx+sendtotal) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.srcaddr](#Tx+srcaddr) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.trailer](#Tx+trailer) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.txfee](#Tx+txfee) : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
        * [.txsig](#Tx+txsig) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.weight](#Tx+weight) : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.crc16compute()](#Tx+crc16compute) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.crc16test()](#Tx+crc16test) ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
        * [.getTxData()](#Tx+getTxData) ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
        * [.toJSON()](#Tx+toJSON) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * _static_
        * [.length](#Tx.length) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


* * *

<a name="new_Tx_new"></a>

### new Tx()
*FOR ADVANCED USE ONLY!*<br>Although the Tx class *can* be instantiateddirectly, it is **not recommended.**<br>Instead, consider using the staticfunctions in the [Node](#Node) class.


* * *

<a name="Tx+blocknum"></a>

### tx.blocknum : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Get/Set the I/O Block number of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+cbits"></a>

### tx.cbits : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the Capability Bits of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type

**See**: [Mochimo.constants](#module_Mochimo..constants)  

* * *

<a name="Tx+cblock"></a>

### tx.cblock : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Get/Set the Current Block number of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+cblockhash"></a>

### tx.cblockhash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Current Block Hash of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0000... &lt;64 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 64 hexadecimal character String or 32 byte Array.


* * *

<a name="Tx+changetotal"></a>

### tx.changetotal : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Get/Set the Transaction Change Amount of a Transaction Buffer. Valuerepresents nanoMochimo.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+chgaddr"></a>

### tx.chgaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Transaction Change Address of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0000... &lt;4408 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 4416 hexadecimal character String or 2208 byte Array.


* * *

<a name="Tx+crc16"></a>

### tx.crc16 : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the CRC16 Hash of a Transaction Buffer<br><sup>&ast;Setting this property is **NOT RECOMMENDED**

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+dstaddr"></a>

### tx.dstaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Transaction Destination Address of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0000... &lt;4408 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 4416 hexadecimal character String or 2208 byte Array.


* * *

<a name="Tx+id1"></a>

### tx.id1 : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the first ID of a Transaction Buffer.<br><sup>&ast;Setting this property is **NOT RECOMMENDED**

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+id2"></a>

### tx.id2 : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the second ID of a Transaction Buffer.<br><sup>&ast;Setting this property is **NOT RECOMMENDED**

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>-1</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+len"></a>

### tx.len : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the Transaction Length of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+network"></a>

### tx.network : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set&ast; the Network Version of a Transaction Buffer.<br><sup>&ast;Setting this property is **NOT RECOMMENDED**

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0xABCD</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+opcode"></a>

### tx.opcode : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the Operation Code of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>OP_NULL</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type

**See**: [Mochimo.constants](#module_Mochimo..constants)  

* * *

<a name="Tx+pblockhash"></a>

### tx.pblockhash : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Previous Block Hash of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0000... &lt;64 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 64 hexadecimal character String or 32 byte Array.


* * *

<a name="Tx+pversion"></a>

### tx.pversion : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the Protocol Version of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>4</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+sendtotal"></a>

### tx.sendtotal : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Get/Set the Transaction Send Amount of a Transaction Buffer. Valuerepresents nanoMochimo.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+srcaddr"></a>

### tx.srcaddr : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Transaction Source Address of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0000... &lt;4408 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 4416 hexadecimal character String or 2208 byte Array.


* * *

<a name="Tx+trailer"></a>

### tx.trailer : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get/Set the Trailer of a Transaction Buffer.<br><sup>&ast;Setting this property is **NOT RECOMMENDED**

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+txfee"></a>

### tx.txfee : [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
Get/Set the Transaction Fee Amount of a Transaction Buffer. Valuerepresents nanoMochimo.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set value cannot be converted to the original type


* * *

<a name="Tx+txsig"></a>

### tx.txsig : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Transaction Signature of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>0n</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 4288 hexadecimal character String or 2144 byte Array.


* * *

<a name="Tx+weight"></a>

### tx.weight : [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get/Set the Blockchain Weight of a Transaction Buffer.

**Kind**: instance property of [<code>Tx</code>](#Tx)  
**Default**: <code>&quot;0... &lt;up to 64 characters&gt;&quot;</code>  
**Throws**:

- <code>TypeError</code> when set an invalid data type&ast;<br><sup>*Valid datatypes are hexadecimal [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- <code>TypeError</code> when set a value of invalid length&ast;<br><sup>&ast;Must be 1-64 hexadecimal character String or 1-32 byte Array.


* * *

<a name="Tx+crc16compute"></a>

### tx.crc16compute() ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Perform a CRC16 hash on 8916 bytes of the underlying transaction buffer.<br><sup>*This function was ported directly from the Mochimo Codebasecrc16.c file*

**Kind**: instance method of [<code>Tx</code>](#Tx)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - The CRC16 hash value (16 bit unsigned)  

* * *

<a name="Tx+crc16test"></a>

### tx.crc16test() ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
Validate the CRC16 hash value of the Tx this function is called.

**Kind**: instance method of [<code>Tx</code>](#Tx)  
**Returns**: [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) - Result of validation  

* * *

<a name="Tx+getTxData"></a>

### tx.getTxData() ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
Obtain the Transaction Data of a Transaction Buffer (Tx) in a new typedarray (with a new underlying buffer).

**Kind**: instance method of [<code>Tx</code>](#Tx)  

* * *

<a name="Tx+toJSON"></a>

### tx.toJSON() ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: instance method of [<code>Tx</code>](#Tx)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - Tx class object, in JSON format  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pversion | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | *refer to Tx class properties* |
| cbits | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| network | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| id1 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| id2 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| cblock | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |  |
| blocknum | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |  |
| cblockhash | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| pblockhash | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| weight | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |  |
| len | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| data | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | *present only if opcode != `OP_TX`* |
| srcaddr | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | *present only if opcode is `OP_TX`* |
| dstaddr | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | *present only if opcode is `OP_TX`* |
| chgaddr | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | *present only if opcode is `OP_TX`* |
| sendtotal | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | *present only if opcode is `OP_TX`* |
| changetotal | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | *present only if opcode is `OP_TX`* |
| txfee | [<code>BigInt</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | *present only if opcode is `OP_TX`* |
| txsig | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | *present only if opcode is `OP_TX`* |
| crc16 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |
| trailer | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |  |


* * *

<a name="Tx.length"></a>

### Tx.length : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Breakdown:- 2x Bytes (8bit), 2 bytes- 6x Words (16bit), 12 bytes- 2x Blocknumbers (64bit), 16bytes- 3x WOTS+ (inc. tag), 6624 bytes- 3x Amounts (64bit), 24 bytes- 1x Signature (WOTS+), 2144 bytes- 3x Hashes (sha256), 96 bytes

**Kind**: static property of [<code>Tx</code>](#Tx)  
**Constant_value**: `8920`  

* * *

<a name="Wots"></a>

## Wots
The Wots class provides utility functions to generate, sign andverify WOTS+ addresses used by the Mochimo Network Blockchain, as well as afew pointer constants for positions of intra-address components.

**Kind**: global class  

* [Wots](#Wots)
    * [.ADDRp](#Wots.ADDRp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.PUBSEEDp](#Wots.PUBSEEDp) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.SIGLEN](#Wots.SIGLEN) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.generate([seed])](#Wots.generate) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * [.pkFromSig(signature, message, pubSeed, addr)](#Wots.pkFromSig) ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * [.sign(message, secret)](#Wots.sign) ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
    * [.verify(signature, message, address)](#Wots.verify) ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


* * *

<a name="Wots.ADDRp"></a>

### Wots.ADDRp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Pointer to the ADDR portion of a WOTS+ address

**Kind**: static property of [<code>Wots</code>](#Wots)  
**Constant_value**: `2176`  

* * *

<a name="Wots.PUBSEEDp"></a>

### Wots.PUBSEEDp : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Pointer to the Public Seed portion of a WOTS+ address

**Kind**: static property of [<code>Wots</code>](#Wots)  
**Constant_value**: `2144`  

* * *

<a name="Wots.SIGLEN"></a>

### Wots.SIGLEN : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
The byte length of a WOTS+ Signature

**Kind**: static property of [<code>Wots</code>](#Wots)  
**Constant_value**: `2144`  

* * *

<a name="Wots.generate"></a>

### Wots.generate([seed]) ⇒ [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
Generate a WOTS+ address and secret pair, with or without a seed.

**Kind**: static method of [<code>Wots</code>](#Wots)  
**Returns**: [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) - <br>`Object.address`: The generated WOTS+ address,<br>`Object.secret`: The secret key associated with the address  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Array of binary data (preferably random) <br><sup>*If no seed is supplied, a 32-byte CSPRNG seed will be provided.* |

**Example**  
```js
example fileconst { Wots } = require('mochimo');const { randomBytes } = require('crypto');const wots = Wots.generate(randomBytes(32));console.log('WOTS+ address:', Buffer.from(wots.address).toString('hex'));console.log('WOTS+ secret:', wots.secret);
```

* * *

<a name="Wots.pkFromSig"></a>

### Wots.pkFromSig(signature, message, pubSeed, addr) ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
Generate&ast; a WOTS+ public address key from a WOTS+ signature.<br><sup>&astMust have access to signed message, and Public Seed and ADDRportions of the full WOTS+ address.

**Kind**: static method of [<code>Wots</code>](#Wots)  
**Returns**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) - Public key portion of WOTS+ address  
**Throws**:

- <code>TypeError</code> when __signature__ is not 2144 bytes long
- <code>TypeError</code> when __pubSeed__ is not 32 bytes long
- <code>TypeError</code> when __addr__ is not 32 bytes long


| Param | Type | Description |
| --- | --- | --- |
| signature | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The WOTS+ signature |
| message | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The message used to sign |
| pubSeed | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Public Seed portion of WOTS+ address <br><sup>&ast;32 bytes starting at byte 2144 of WOTS+ address |
| addr | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | ADDR portion of WOTS+ address <br><sup>&ast;32 bytes starting at byte 2176 of WOTS+ address |

**Example**  
```js
const { Wots, constants } = require('mochimo');const { randomBytes } = require('crypto');const pkSecret = Wots.generate();const message = randomBytes(constants.TRANLEN);const signature = Wots.sign(message, pkSecret.secret);const pubSeed = pkSecret.address.subarray(Wots.PUBSEEDp, 32);const addr = pkSecret.address.subarray(Wots.ADDRp, 32);const pkFromSig = Wots.pkFromSig(signature, message, pubSeed, addr);console.log(pkFromSig.some((curr, i) => curr !== pkSecret.address[i]  ? 'result is different' : 'result is identical');
```

* * *

<a name="Wots.sign"></a>

### Wots.sign(message, secret) ⇒ [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
Generate a WOTS+ Signature from a message and secret.

**Kind**: static method of [<code>Wots</code>](#Wots)  
**Returns**: [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) - A WOTS+ Signature  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The message to be signed |
| secret | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | A secret&ast;<br><sup>&ast;Must have been generated by `Wots.generate()` |

**Example**  
```js
const { Wots, TRANLEN } = require('mochimo');const { randomBytes } = require('crypto');const pkSecret = Wots.generate();const message = randomBytes(TRANLEN);const signature = Wots.sign(message, pkSecret.secret);console.log('WOTS+ Signature: ' + Buffer.from(signature).toString('hex'));
```

* * *

<a name="Wots.verify"></a>

### Wots.verify(signature, message, address) ⇒ [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
Verify a WOTS+ signature against a known message and WOTS+ address.

**Kind**: static method of [<code>Wots</code>](#Wots)  
**Returns**: [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) - Verification result  
**Throws**:

- <code>TypeError</code> when __signature__ is not 2144 bytes long
- <code>TypeError</code> when __address__ is not 2208 bytes long


| Param | Type | Description |
| --- | --- | --- |
| signature | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The WOTS+ signature |
| message | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The message used to sign |
| address | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | The WOTS+ address to verify against the signature |

**Example**  
```js
const { Wots, TXSIGLEN, TRANLEN, TXADDRLEN } = require('mochimo');const signature = Buffer.alloc(TXSIGLEN); // 2144 byte arrayconst message = Buffer.alloc(TRANLEN); // 8792 byte arrayconst address = Buffer.alloc(TXADDRLEN); // 2208 byte arrayconsole.log('WOTS+ signature verification',  Wots.verify(signature, message, address) ? 'valid' : 'not valid');
```

* * *


// END OF DOCUMENTATION...

---
