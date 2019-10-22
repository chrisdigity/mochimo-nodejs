/**
 * Map the Mochimo Network.
 *
 * Acquire a list of all accesible nodes on the network.
 */

/* eslint-env es6 */
const {Core, VEOK} = require('../mochimo.js');

const MochiCore = new Core();
// MochiCore.setDebug(1);
const result = MochiCore.mapNetwork(function(ipl) {
  console.log('MochiCore returned %d IPs:\n%j', ipl.length, ipl);
}, ['164.68.101.85', '34.94.69.50', '184.166.146.67']);
if (result != VEOK) {
  console.log('mapNetwork() call failed to execute!');
} else {
  console.log('mapNetwork() call successful. Waiting for result...');
}
