### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### v0.1.0 - 22 October 2019

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

