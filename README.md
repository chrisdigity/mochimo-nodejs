# Welcome to Mochimo for NodeJs.
Mochimo for NodeJs allows easy integration into the
[Mochimo Cryptocurrency Network](https://mochimo.org/).
>**This version of the Mochimo module is "pre-release"...**  
*Please use with caution, and report issues here on Github...*


## How to use the module
### Prerequisites
You need the latest `npm` and `nodejs` software installed.
### Installation
```console
veronica@MochiNet:~$ cd myMochimoProject
veronica@MochiNet:~/myMochimoProject/$ npm install mochimo
```
### Initialization
```js
// ES6
const {Core, VEOK, OP_GETIPL} = require('mochimo');

// Older
var Mochimo = require('mochimo');
var Core = new Mochimo.Core();
var VEOK = Mochimo.VEOK;
var OP_GETIPL = Mochimo.OP_GETIPL;
```
### More Information
See the [documentation](docs/README.md) for more information on the module and
how you can best utilize it.  
The [changelog](docs/CHANGELOG.md) contains a list version changes... *pfft
boring...*   
Otherwise, checkout some [examples](examples).  
<sup>(*SPOILER ALERT: There's only one example* :P)</sup>


## Contribution
### Issues
If the module doesn't operate correctly, raise an issue.  
If the module doesn't do what you expected, raise an issue.  
If your boss is harassing you then RAISE AN ISSUE!  
...ahem- Don't be shy.
### Docs
English is hard... so rephrasing Documentation and README's where necessary is
greatly appreciated.
### Code
This module uses JsDoc style commenting to create a documentation markdown file
for Github.  
Please add JsDoc style comments to your pull requests where necessary.


## License
This module is released under an MPL2.0 derivative Open Source license.  
The community is free to develop and change the code with the caveat that any
changes must be for the benefit of the Mochimo Cryptocurrency Network (with a
number of exclusions).  
Please read [LICENSE.PDF](LICENSE.PDF) for more details on limitations and
restrictions.

The Mochimo for NodeJs is copyright 2019 Adequate Systems, LLC.  
Please read the license file in the package for additional restrictions.
