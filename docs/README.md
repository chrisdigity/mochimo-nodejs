<a name="module_mochimo"></a>

## mochimo
Required Core Modules: fs, net, util;

**Example**  
```js
const Mochimo = require('mochimo');
```

* [mochimo](#module_mochimo)
    * [~Core](#module_mochimo..Core)
        * [new Core()](#new_module_mochimo..Core_new)
        * [.callserver(callback, peer, opcode)](#module_mochimo..Core+callserver) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.decodeInfo(tx)](#module_mochimo..Core+decodeInfo) ⇒ [<code>NodeInfo</code>](#module_mochimo..NodeInfo)
        * [.mapNetwork(callback, startPeer, reset)](#module_mochimo..Core+mapNetwork) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.getCurrentPeers()](#module_mochimo..Core+getCurrentPeers) ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.getRecentPeers()](#module_mochimo..Core+getRecentPeers) ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
        * [.setCbits(bits)](#module_mochimo..Core+setCbits) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.setCorems(ms)](#module_mochimo..Core+setCorems) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.setDebug(val)](#module_mochimo..Core+setDebug) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.setMaxSockets(max)](#module_mochimo..Core+setMaxSockets) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.setPort(port)](#module_mochimo..Core+setPort) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
        * [.setPversion(version)](#module_mochimo..Core+setPversion) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~VEOK](#module_mochimo..VEOK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~VERROR](#module_mochimo..VERROR) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~VEBAD](#module_mochimo..VEBAD) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~VETIMEOUT](#module_mochimo..VETIMEOUT) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~INVALID_SOCKET](#module_mochimo..INVALID_SOCKET) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~C_PUSH](#module_mochimo..C_PUSH) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~C_WALLET](#module_mochimo..C_WALLET) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~C_SANCTUARY](#module_mochimo..C_SANCTUARY) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~C_MFEE](#module_mochimo..C_MFEE) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~C_LOGGING](#module_mochimo..C_LOGGING) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_NULL](#module_mochimo..OP_NULL) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_HELLO](#module_mochimo..OP_HELLO) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_HELLO_ACK](#module_mochimo..OP_HELLO_ACK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_TX](#module_mochimo..OP_TX) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_FOUND](#module_mochimo..OP_FOUND) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_GETBLOCK](#module_mochimo..OP_GETBLOCK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_GETIPL](#module_mochimo..OP_GETIPL) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_SEND_BL](#module_mochimo..OP_SEND_BL) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_SEND_IP](#module_mochimo..OP_SEND_IP) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_BUSY](#module_mochimo..OP_BUSY) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_NACK](#module_mochimo..OP_NACK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_GET_TFILE](#module_mochimo..OP_GET_TFILE) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_BALANCE](#module_mochimo..OP_BALANCE) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_SEND_BAL](#module_mochimo..OP_SEND_BAL) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_RESOLVE](#module_mochimo..OP_RESOLVE) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_GET_CBLOCK](#module_mochimo..OP_GET_CBLOCK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_MBLOCK](#module_mochimo..OP_MBLOCK) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_HASH](#module_mochimo..OP_HASH) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_TF](#module_mochimo..OP_TF) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~OP_IDENTIFY](#module_mochimo..OP_IDENTIFY) : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [~Node](#module_mochimo..Node) : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
    * [~NodeInfo](#module_mochimo..NodeInfo) : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)


* * *

<a name="module_mochimo..Core"></a>

### mochimo~Core
**Kind**: inner class of [<code>mochimo</code>](#module_mochimo)  

* [~Core](#module_mochimo..Core)
    * [new Core()](#new_module_mochimo..Core_new)
    * [.callserver(callback, peer, opcode)](#module_mochimo..Core+callserver) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.decodeInfo(tx)](#module_mochimo..Core+decodeInfo) ⇒ [<code>NodeInfo</code>](#module_mochimo..NodeInfo)
    * [.mapNetwork(callback, startPeer, reset)](#module_mochimo..Core+mapNetwork) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.getCurrentPeers()](#module_mochimo..Core+getCurrentPeers) ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    * [.getRecentPeers()](#module_mochimo..Core+getRecentPeers) ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    * [.setCbits(bits)](#module_mochimo..Core+setCbits) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.setCorems(ms)](#module_mochimo..Core+setCorems) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.setDebug(val)](#module_mochimo..Core+setDebug) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.setMaxSockets(max)](#module_mochimo..Core+setMaxSockets) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.setPort(port)](#module_mochimo..Core+setPort) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    * [.setPversion(version)](#module_mochimo..Core+setPversion) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


* * *

<a name="new_module_mochimo..Core_new"></a>

#### new Core()
Mochimo Core is the base class of the NodeJs implementation. It contains
protocols and functions necessary for integration with the Mochimo Network.
Mochimo Core is most useful for utilizing or extending this functionality
into your own application. Developers who wish to create a truly custom
application that integrates into the Mochimo Network should start here.

**Example**  
```js
const {Core} = require('mochimo');
const MochimoCore = new Core();
```

* * *

<a name="module_mochimo..Core+callserver"></a>

#### core.callserver(callback, peer, opcode) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Connect to a Mochimo Network Node and request data.<br>**Note:** Not
compatible with advanced opcode types requiring data to be sent with the
request.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>Function</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) | Callback function, receives Node object result |
| peer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of the Mochimo NODE |
| opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Operation code to request |

**Example**  
```js
MochimoCore.callserver(function(node) {
  console.log('callserver() returned node:\n%j', node);
}, '127.0.0.1', OP_GETIPL);

/* OUTPUT
callserver() returned node:
{ "ip": "127.0.0.1", "id1": ...}
```

* * *

<a name="module_mochimo..Core+decodeInfo"></a>

#### core.decodeInfo(tx) ⇒ [<code>NodeInfo</code>](#module_mochimo..NodeInfo)
Decode Mochimo Node information from it's Transaction Data.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>NodeInfo</code>](#module_mochimo..NodeInfo) - An object containing Mochimo Node information  

| Param | Type | Description |
| --- | --- | --- |
| tx | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Transaction Data from a Node |

**Example**  
```js
const nodeInfo = MochimoCore.decodeInfo(node.tx);
console.log('decodeInfo() returned:\n%j', nodeInfo);

/* OUTPUT
decodeInfo() returned:
{ "version": 4, "cbits": 1, "network": ... }
```

* * *

<a name="module_mochimo..Core+mapNetwork"></a>

#### core.mapNetwork(callback, startPeer, reset) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Build a fresh map of the Mochimo Network by updating the peer lists of all
available (non-busy) nodes on the network.<br>**Note:** If a second call to
mapNetwork is made before the first one finishes, the first callback will
be overwritten by the second.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Core status indicating the success of the
function  

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>Function</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) | The callback that handles the final array of active nodes. Called after the map has been finalised. |
| startPeer | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | (Optional) Add peers to RecentPeers before building the network map. |
| reset | [<code>Boolean</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | (Optional) Clear RecentPeers list before building network map. For clearing inactive RecentPeers. |

**Example**  
```js
MochimoCore.mapNetwork(function(ipl) {
  console.log('mapNetwork returned %d IPs:\n%j', ipl.length, ipl);
}, '127.0.0.1');

/* OUTPUT:
mapNetwork returned 54 IPs:
["34.94.69.50","184.166.146.67","35.197.180.194","164.68.101.85",...]
```

* * *

<a name="module_mochimo..Core+getCurrentPeers"></a>

#### core.getCurrentPeers() ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get a list of current/active peers on the network.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) - A duplicate of CurrentPeers  

* * *

<a name="module_mochimo..Core+getRecentPeers"></a>

#### core.getRecentPeers() ⇒ [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
Get a list of recent/all peers on the network.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Array.&lt;String&gt;</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) - A duplicate of RecentPeers  

* * *

<a name="module_mochimo..Core+setCbits"></a>

#### core.setCbits(bits) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the compatibility bits of this instance.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| bits | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The 8 bit decimal formation of compatibility bits |


* * *

<a name="module_mochimo..Core+setCorems"></a>

#### core.setCorems(ms) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the delay between Core callbacks and looping functions.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| ms | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Time in milliseconds |


* * *

<a name="module_mochimo..Core+setDebug"></a>

#### core.setDebug(val) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the Core console output verbosity for debugging.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| val | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Debug value of verbosity |


* * *

<a name="module_mochimo..Core+setMaxSockets"></a>

#### core.setMaxSockets(max) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the maximum concurrent sockets the Core can use at any one time.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| max | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Maximum number of concurrent sockets |


* * *

<a name="module_mochimo..Core+setPort"></a>

#### core.setPort(port) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the destination port used to connect to the Mochimo Network.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| port | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Socket destination port |


* * *

<a name="module_mochimo..Core+setPversion"></a>

#### core.setPversion(version) ⇒ [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Set the protocol version used to connect to the Mochimo Network. If there
has been a protocol update (hard fork) this must be used to set the
appropriate protocol version, otherwise you connection to the Mochimo
Network may be rejected.

**Kind**: instance method of [<code>Core</code>](#module_mochimo..Core)  
**Returns**: [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) - Status indicating the success of the function  

| Param | Type | Description |
| --- | --- | --- |
| version | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Mochimo Protocol Version |


* * *

<a name="module_mochimo..VEOK"></a>

### mochimo~VEOK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Return status for no issues.<br>**Value:** `0`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..VERROR"></a>

### mochimo~VERROR : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Return status for a failure.<br>**Value:** `1`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..VEBAD"></a>

### mochimo~VEBAD : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Return status for a failure and possible malice.<br>**Value:** `2`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..VETIMEOUT"></a>

### mochimo~VETIMEOUT : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Return status for a timeout.<br>**Value:** `-1`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..INVALID_SOCKET"></a>

### mochimo~INVALID\_SOCKET : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Placeholder for an unused [net.Socket](https://nodejs.org/api/net.html#net_class_net_socket)
variable.<br>**Value:** `-1`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..C_PUSH"></a>

### mochimo~C\_PUSH : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Compatibility bit indicating the availability of Block Pushing transactions
used by the Mochimo Windows Headless Miner.<br>**Value:** `1`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..C_WALLET"></a>

### mochimo~C\_WALLET : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Compatibility bit indicating the operation of a wallet.<br>**Value:** `2`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..C_SANCTUARY"></a>

### mochimo~C\_SANCTUARY : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Compatibility bit indicating to the network that the node has activated the
Sanctuary Protocol.<br>**Value:** `4`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..C_MFEE"></a>

### mochimo~C\_MFEE : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Compatibility bit indicating the desired Fee change outcome of the Sanctuary
Protocol.<br>**Value:** `8`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..C_LOGGING"></a>

### mochimo~C\_LOGGING : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Compatibility bit indicating the availability of Logging.<br>**Value:** `16`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_NULL"></a>

### mochimo~OP\_NULL : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Null operation code. Not used but usually indicating a lack of socket
initialization during a transaction of data.<br>**Value:** `0`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_HELLO"></a>

### mochimo~OP\_HELLO : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Hello operation code. Used as a request code to initiate the first step of a
Mochimo 3-way handshake.<br>**Value:** `1`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_HELLO_ACK"></a>

### mochimo~OP\_HELLO\_ACK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Hello Acknowledgement operation code. Used as a return code to indicate the
second step of a Mochimo 3-way handshake.<br>**Value:** `2`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_TX"></a>

### mochimo~OP\_TX : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Transaction operation code. Used as a request code to send a signed
transaction to a Node for distribution across the Mochimo Network.
<br>**Value:** `3`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_FOUND"></a>

### mochimo~OP\_FOUND : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Block Found operation code. Used as a network alert code indicating the
existence of a new block update available for download. To obtain the block
update, a new socket connection and opcode must be used.<br>**Value:** `4`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_GETBLOCK"></a>

### mochimo~OP\_GETBLOCK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get Block operation code. Used as a request code to get/download a block from
a Node. This operation can take some time if requesting a neogensis block,
due to network speed and ledger file size.<br>**Value:** `5`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_GETIPL"></a>

### mochimo~OP\_GETIPL : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get IP List operation code. Used as a request code when requesting a Node's
peer list.<br>**Value:** `6`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_SEND_BL"></a>

### mochimo~OP\_SEND\_BL : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Send Block operation code. Used as a return code for validation when sending
a block, usually after an OP_GETBLOCK is received.<br>**Value:** `7`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_SEND_IP"></a>

### mochimo~OP\_SEND\_IP : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Send IP List operation code. Used as a validation code when sending a peer
list, usually after an OP_GETIPL is received.<br>**Value:** `8`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_BUSY"></a>

### mochimo~OP\_BUSY : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Busy operation code. Used as a return code to indicate that a Node is
currently busy and unable to process a request.<br>**Value:** `9`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_NACK"></a>

### mochimo~OP\_NACK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
No Acknowledgement operation code? The workings of this code is currently
unknown, as it is unused throughout the codebase. I'm sure if I was to ask of
it's original purpose I would get a clear and concise response. For now, this
obnoxiously unhelpful description will serve as one of my adequate systems of
unusual humor.<br>**Value:** `10`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_GET_TFILE"></a>

### mochimo~OP\_GET\_TFILE : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get Trailer File operation code. Used as a request code to get/download a
Node's entire Tfile. This operation can take some time, due to network speed
and Tfile size.<br>**Value:** `11`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_BALANCE"></a>

### mochimo~OP\_BALANCE : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Address Balance operation code. Used as a request code when requesting the
balance of a Mochimo Address.<br>**Value:** `12`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_SEND_BAL"></a>

### mochimo~OP\_SEND\_BAL : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Send Address Balance operation code. Used as a return code for validation
when sending the balance of a Mochimo Address.<br>**Value:** `13`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_RESOLVE"></a>

### mochimo~OP\_RESOLVE : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Resolve Tag operation code. Used as a request/return code when requesting the
Mochimo Address registered to a Mochimo Tag.<br>**Value:** `14`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_GET_CBLOCK"></a>

### mochimo~OP\_GET\_CBLOCK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Get Candidate Block operation code. Used as a request code to get/download a
candidate block from a Node. Candidate blocks include all recent transactions
for a Windows Headless Miner to find a solution to.<br>**Value:** `15`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_MBLOCK"></a>

### mochimo~OP\_MBLOCK : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Mined Block operation code. Used as a network alert code indicating that a
Windows Headless Miner has found a solution to a candidate block it received
and requires assistance distributing the block update. Unlike OP_FOUND, the
socket connection stays open to continue sending the block update along with
OP_SEND_BL.<br>**Value:** `16`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_HASH"></a>

### mochimo~OP\_HASH : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Block Hash operation code. Used as a request/return code when requesting the
block hash of a specified block number.<br>**Value:** `17`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_TF"></a>

### mochimo~OP\_TF : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Partial Trailer File operation code. Used as a request code to get/download a
section of a Trailer File. Requests can be up to 1000 trailers in size, and
the operation is validated with an OP_SEND_BL return code.<br>**Value:** `18`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..OP_IDENTIFY"></a>

### mochimo~OP\_IDENTIFY : [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
Identify operation code. Used as a request/return code to identify which
nodes have activated the Sanctuary protocol and obtain their Santuary
specifications.<br>**Value:** `19`

**Kind**: inner constant of [<code>mochimo</code>](#module_mochimo)  

* * *

<a name="module_mochimo..Node"></a>

### mochimo~Node : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: inner typedef of [<code>mochimo</code>](#module_mochimo)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ip | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | IPv4 address of the Node |
| id1 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | 3-way handshake verification ID #1 |
| id2 | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | 3-way handshake verification ID #2 |
| called | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Time (in ms) when the socket communication was intiated |
| status | [<code>String</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | The assumed remote status of the Node |
| tx | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Socket transaction data |
| data | [<code>ArrayBuffer</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | Socket intended data |
| txp | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Socket transaction data pointer |
| datap | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Socket intended data pointer |
| socket | [<code>Socket</code>](https://nodejs.org/api/net.html#net_class_net_socket) \| [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | The Socket object that handles the communication with a Node.<br>INVALID_SOCKET when unused |


* * *

<a name="module_mochimo..NodeInfo"></a>

### mochimo~NodeInfo : [<code>Object</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects)
**Kind**: inner typedef of [<code>mochimo</code>](#module_mochimo)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| version | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Protocol version |
| cbits | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Compatibility bits |
| network | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Network version |
| opcode | [<code>Number</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | Last opcode received |
| bnum | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | I/O block number (64 bit little endian) |
| cbnum | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Current block number (64 bit little endian) |
| chash | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Current block hash (32 bytes) |
| phash | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Previous block hash (32 bytes) |
| weight | [<code>Uint8Array</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Current chain weight (32 bytes) |


* * *

