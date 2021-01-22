
/* Mochimo PRNG adaptation, from rand.c */
const rand16 = () => {
  rand16.Lseed = ((rand16.Lseed * 69069) + 262145) >>> 0;
  return (rand16.Lseed >>> 16);
};
const rand2 = () => {
  rand2.Lseed2 = ((rand2.Lseed2 * 69069) + 262145) >>> 0;
  if (rand2.Lseed3 === 0) rand2.Lseed3 = 362436069;
  rand2.Lseed3 = 36969 * (rand2.Lseed3 & 65535) + (rand2.Lseed3 >>> 16);
  if (rand2.Lseed4 === 0) rand2.Lseed4 = 123456789;
  rand2.Lseed4 ^= (rand2.Lseed4 << 17);
  rand2.Lseed4 ^= (rand2.Lseed4 >>> 13);
  rand2.Lseed4 ^= (rand2.Lseed4 << 5);
  return (rand2.Lseed2 ^ (rand2.Lseed3 << 16) ^ rand2.Lseed4) >> 16;
};
// declare start time in integer seconds
const Stime = (Date.now() / 1000) >>> 0;
// static initial seeds for Mochimo PRNG
rand16.Lseed = process.pid ^ Stime;
rand2.Lseed2 = Stime;
rand2.Lseed3 = 0;
rand2.Lseed4 = process.pid ^ 123456789;

module.exports = { rand16, rand2 };
