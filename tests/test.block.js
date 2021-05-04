
const { Test } = require('./testutils');
const fs = require('fs');
const {
  Block
} = require('../src/mochimo');

// data sources
const BlockNormalFname = 'b00000000000426f3.bc';
const BlockNormal = new Block(fs.readFileSync(BlockNormalFname));
const BlockNormalBnum = 0x426f3n;

// execute base configuration tests
module.exports = {
  'new Block()': [
    Test(typeof BlockNormal, 'exactly', 'object', 'Return value Object'),
    Test(BlockNormal, 'instanceof', Block, 'Instance of Block'),
    Test(BlockNormal?.type, 'exactly', Block.NORMAL, 'Correct block type'),
    Test(BlockNormal?.bnum, 'exactly', BlockNormalBnum, 'Correct block number'),
    Test(BlockNormal.verifyBlockHash(), 'exactlynot',
      BlockNormal.verifyBlockHash('abc'), 'Block.verifyBlockHash() operates')
  ]
};
