### Changelog

All notable changes to this project will be documented in this file.

### [v0.2.2](https://github.com/chrisdigity/mochimo-nodejs/releases/tag/v0.2.3) - 2021-02-08

Updates to the `Block.toSummary()` and (indirectly) `Block.toJSON()` functions.

```diff
+ Added haiku string to Block.toSummary()
# Changed the order of properties in Block.toSummary()
- Removed hdrlen from Block.toSummary()
```

### [v0.2.2](https://github.com/chrisdigity/mochimo-nodejs/releases/tag/v0.2.2) - 2021-02-07

There were some unnoticed artifacts from old code in the Block class causing
transactions and ledger entries to be misread. This has been addressed and
access to transaction and ledger properties now result in a valid outcome.
PLEASE NOTE! This release includes BREAKING CHANGES to the specification for the TXReference class.

```diff
! Fixed the way transactions and ledger entries are derived from the Block class
# Changed the TXReference class specification to include the source address
```

### [v0.2.1](https://github.com/chrisdigity/mochimo-nodejs/releases/tag/v0.2.1) - 2021-02-04

Found a need to Summarize a Block class to block header and trailer info, excluding block contents.

```diff
+ Added toSummary() to Block class
```

### [v0.2.0](https://github.com/chrisdigity/mochimo-nodejs/releases/tag/v0.2.0) - 202-01-22

The big ES6 Module Overhaul. "Big Arrow" type functions, promises and async/await compatibility.
Introduces:
- the Mochimo module as the basis for all things great and delicious, replacing silly names like Core or MochimoCore
- async/await [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) behavior throughout the module
- standard get&ast; functions for common network requests, directly accesible in the Mochimo module
- internal LOG module for easier management of API debugging

```diff
+ Added LOG* class to module
+ Added LEntry*, TXReference*, and TXEntry* blockchain related classes to module
+ Added BlockTrailer, Block, and Tfile blockchain related classes to module
+ Added Trigg class with limited functionality to module (not documented)
! Fixed potential duplicate peer handling in node.socket "data" event
# Changed Node class format to hold static functions handling peer communication
# Changed commenting style for ability to easily comment out segments of code
# Changed scope of certain internal functions to suit multiple top level classes
- Removed unnecessary peer handling in Mochimo module
- Removed erroneous functions in Mochimo module

! Fixed spelling of asterisk in DOCS/CHANGELOG
! Fixed some descriptions in DOCS/README.MD

# (*) asterisk indicates private
```

### [v0.1.1](https://github.com/chrisdigity/mochimo-nodejs/releases/tag/v0.1.1) - 2019-10-31

Introduces:
- various bug fixes and updates to Debug logging for `Core()` functions

```diff
! Fixed stopwatch issue with Core.mapNetwork()
! Fixed reset functionality in Core.mapNetwork()
! Fixed incorrect return value for Core.addPeer()*
# Changed Debug logging for Core.addPeer()*
# Changed Debug logging for Core.callserver()

# (*) asterisk indicates private
```

#### v0.1.0 - 2019-10-22

- Initial pre-release v0.1.0 [`4e81341`](https://github.com/chrisdigity/mochimo-nodejs/commit/4e8134110e06f450348e82ec00c321e4461ce244)
- Introduces base Mochimo Network integration class `Core()`

```diff
+ Added Return Status Constants [ VEOK, ...]
+ Added Compatibility Bit Constants [ C_PUSH, ...]
+ Added INVALID_SOCKET Constant
+ Added OP Code Constants [ OP_NULL, OP_HELLO, ...]
+ Added Typdefs for Node and NodeInfo Objects
+ Added Class Core(), basic Mochimo Network integration
+ Added Core.callserver()
+ Added Core.decodeInfo()
+ Added Core.mapNetwork()
+ Added Core.getCurrentPeers()
+ Added Core.getRecentPeers()
+ Added Core.setCbits()
+ Added Core.setCorems()
+ Added Core.setDebug()
+ Added Core.setMaxSockets()
+ Added Core.setPort()
+ Added Core.setPversion()

+ Added Initial Documentation
+ Added Example mapnetwork.js
```
