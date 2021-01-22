
/* requirements */
const { isIPv4, Socket } = require('net');
const { format } = require('util');

/* private logging constants */
const ERROR = -2;
const WARN = -1;
const INFO = 0;
const VERBOSE = 1;
const DEBUG = 2;
const LL = (() => {
  // obtain user configured log level from 2 possible sources
  let ll = process.env.MOCHIMO_LOG_LEVEL || '';
  // match log level with predefined levels of logging
  ll = ['error', 'warn', 'info', 'verbose', 'debug'].indexOf(ll.toLowerCase());
  // Default log level 'warn' (-1)
  return (ll < 0) ? ll : ll - 2;
})();

/**
 * @class
 * @classdesc Custom logging for primarily internal (asexual) use.
 * ```
 * Integers:             -2,       -1,      0,       1,          2
 * Log Levels:          'error',  'warn',  'info',  'verbose',  'debug'
 * Standard Functions:   error(),  warn(),  info(),  verbose(),  debug()
 * Time based Functions: errorT(), warnT(), infoT(), verboseT(), debugT()
 * ``` */
class LOG {
  static elapsed (from) {
    // determine elapsed milliseconds
    let remainingTime = Date.now() - from;
    // define time divisions object
    const dTime = { secs: 60000, mins: 60, hrs: 24, days: 7, wks: 52, yrs: 1 };
    // build time string with for..in loop
    let result = '';
    for (const div in dTime) {
      // calculate time in this division
      let time = remainingTime % dTime[div];
      // deduct time from remaining
      remainingTime = (remainingTime - time) / dTime[div];
      // prepend resulting time division
      if (div === 'secs') time /= 1000; // alternate display for (milli)seconds
      if (time) result = `${time}${div} ${result}`;
      // check for remaining time
      if (remainingTime <= 0) break;
    }
    // return final output
    return `in ${result.trim()}`;
  }

  static error (...args) {
    if (LL < ERROR) return args[0];
    process.stderr.write(`MOCHIMO___ERROR: ${format(...args)}\n`);
    return args[0];
  }

  static errorT (from, ...args) {
    if (LL < ERROR) return args[0];
    return LOG.error(...args, LOG.elapsed(from));
  }

  static warn (...args) {
    if (LL <= WARN) return args[0];
    process.stderr.write(`MOCHIMO____WARN: ${format(...args)}\n`);
    return args[0];
  }

  static warnT (from, ...args) {
    if (LL < WARN) return args[0];
    return LOG.warn(...args, LOG.elapsed(from));
  }

  static info (...args) {
    if (LL < INFO) return args[0];
    process.stdout.write(`MOCHIMO____INFO: ${format(...args)}\n`);
    return args[0];
  }

  static infoT (from, ...args) {
    if (LL < INFO) return args[0];
    return LOG.info(...args, LOG.elapsed(from));
  }

  static verbose (...args) {
    if (LL < VERBOSE) return args[0];
    process.stdout.write(`MOCHIMO_VERBOSE: ${format(...args)}\n`);
    return args[0];
  }

  static verboseT (from, ...args) {
    if (LL < VERBOSE) return args[0];
    return LOG.verbose(...args, LOG.elapsed(from));
  }

  static debug (...args) {
    if (LL < DEBUG) return args[0];
    process.stdout.write(`MOCHIMO___DEBUG: ${format(...args)}\n`);
    return args[0];
  }

  static debugT (from, ...args) {
    if (LL <= DEBUG) return args[0];
    return LOG.debug(...args, LOG.elapsed(from));
  }
}

/*********************************************/
/* Mochimo codebase adaptations, from util.c */
const isPrivateIPv4 = (ip) => {
  if ((ip & 0xff) === 0 || (ip & 0xff) === 127) return 1; // class A - host
  if ((ip & 0xff) === 10) return 1; // class A
  if ((ip & 0xff) === 172 &&
      ((ip >> 8) & 0xff) >= 16 && ((ip >> 8) & 0xff) <= 31) {
    return 2; // class B
  }
  if ((ip & 0xff) === 192 && ((ip >> 8) & 0xff) === 168) return 3; // class C
  if ((ip & 0xff) === 169 && ((ip >> 8) & 0xff) === 254) return 4; // auto
  return 0; // public IP
};
/* end Mochimo Codebase adaptations */
/************************************/

/* calculate expected toString() length, given radix and bytes per element */
const radixStringLength = (radix = 16, bpe = 1) => {
  return Math.ceil(Math.log(256 ** bpe) / Math.log(radix));
};

/* convert a TypedArray to a string (overloaded toString method) */
const array2string = (array, radix = 16, le = false, full = true) => {
  // ensure TypedArray
  if (Object.getPrototypeOf(array.constructor).name !== 'TypedArray') {
    throw new TypeError('Mochimo[internal].array2string() cannot accept ' +
      'invalid TypedArray value.');
  }
  // setup defaults
  const reduceFn = le ? 'reduceRight' : 'reduce';
  const padStr = '0';
  let result = '';
  // determine minimum string length for radix
  const min = radixStringLength(radix, array.BYTES_PER_ELEMENT);
  // reduce TypedArray to radix string
  result = array[reduceFn]((acc, curr) => {
    curr = curr.toString(radix).padStart(min, padStr);
    return acc === '00' ? curr : acc + curr;
  }, '');
  // if "full" string requested, pad to maximum string length
  if (full) {
    const max = min * array.length;
    if (max > result.length) {
      result = result.padStart(max, padStr);
    }
  } else {
    // otherwise trim any leading Zeros
    result = result.replace(/^0+/, '');
  }
  // return finalized result
  return result;
};
/* UNUSED...
const inet_aton = (a) => {
  a = a.split('.');
  const b = new ArrayBuffer(4);
  const dv = new DataView(b);
  for (let i = 0; i < 4; i++) dv.setUint8(i, a[i]);
  return dv.getUint32(0, true);
};
const inet_ntoa = (n) => {
  const a = [];
  const b = new ArrayBuffer(4);
  const dv = new DataView(b);
  dv.setUint32(0, n, true);
  for (var i = 0; i < 4; i++) a.push(dv.getUint8(i));
  return a.join('.');
}; */
/* Convert decimal Integer to IPV4 address (dotted-decimal notation) */
const ntoa = (int) => {
  return (int & 0xff) + '.' +
    ((int >>> 8) & 0xff) + '.' +
    ((int >>> 16) & 0xff) + '.' +
    ((int >>> 24) & 0xff);
};

/* Sanitization */
const sanitizeArray = (value, source, max, min, le) => {
  // sanitize and padd source string
  source = `${source ? String(source) + ' ' : ''}cannot accept invalid`;
  // convert hexadecimal String to Array
  if (typeof value === 'string') {
    // remove hexadecimal prefixed
    value = value.replace(/^0x/g, '');
    // validate hexadecimal
    if (!value || value.replace(/[0-9A-Fa-f]/g, '')) {
      throw new TypeError(`${source} hexadecimal String.`);
    }
    // prepend Zero if odd number of characters, so next step works as desired
    if (value.length % 2) value = `0${value}`;
    // convert to regular Array of bytes as hexadecimal strings
    value = value.match(/../g).map(val => `0x${val}`);
    // reverse Array if little endian is flagged
    if (le) value = value.reverse();
  }
  // sanitize Array values
  if (Array.isArray(value)) {
    value.map(val => parseInt(val));
  }
  // sanitize Uint8Array
  value = Uint8Array.from(value);
  // validate min/max
  if (value.byteLength < min || value.byteLength > max) {
    throw new TypeError(`${source} value length.`);
  }
  // return sanitized Uint8Array
  return value;
};
const sanitizeIPv4 = (ipv4, source) => {
  // sanitize and padd source string
  source = `${source ? String(source) + ' ' : ''}cannot accept invalid`;
  // convert array type IPv4 to string
  if (Array.isArray(ipv4)) ipv4 = String(ipv4).replace(/,/g, '.');
  // convert number type IPv4 to string
  if (isNaN(ipv4) === false) ipv4 = ntoa(Number(ipv4));
  // validate IPv4 address
  if (typeof ipv4 !== 'string' || !isIPv4(ipv4)) {
    // throw TypeError on invalid ipv4 address
    throw new TypeError(`${source} IPv4 address.`);
  }
  // return sanitized IPv4 String
  return ipv4;
};
const sanitizeNumber = (num, source) => {
  // sanitize and padd source string
  source = `${source ? String(source) + ' ' : ''}cannot accept invalid`;
  if (isNaN(num)) {
    throw new TypeError(`${source} Number value.`);
  }
  // return sanitized Number
  return Number(num);
};
const sanitizePort = (port, source) => {
  // sanitize and padd source string
  source = `${source ? String(source) + ' ' : ''}cannot accept invalid`;
  // sanitize Number value
  port = sanitizeNumber(port, source);
  // validate port range
  if (port < 1 || port > 65535) {
    // throw TypeError on invalid port range
    throw new TypeError(`${source} Port range... expected 1-65535.`);
  }
  // return sanitized IPv4 String
  return port;
};

module.exports = {
  LOG,
  Socket,
  array2string,
  isPrivateIPv4,
  ntoa,
  sanitizeArray,
  sanitizeIPv4,
  sanitizeNumber,
  sanitizePort
};
