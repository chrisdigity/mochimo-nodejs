
const fsp = require('fs').promises;

const TestCases = {};
const TestFilePrefix = 'test.';
const Pass = (msg) => { process.stdout.write(`  ✔️ ${msg}\n`); return 0; };
const Fail = (msg) => { process.stderr.write(`  ❌ ${msg}\n`); return 1; };
const Is = {
  exactly: (a, b) => {
    a = typeof a === 'object' ? JSON.stringify(a) : a;
    b = typeof b === 'object' ? JSON.stringify(b) : b;
    return a === b ? 1 : 0;
  },
  exactlynot: (a, b) => {
    a = typeof a === 'object' ? JSON.stringify(a) : a;
    b = typeof b === 'object' ? JSON.stringify(b) : b;
    return a !== b ? 1 : 0;
  },
  instanceof: (a, b) => a instanceof b ? 1 : 0
};
const Test = (test) => {
  let func = Fail;
  const { ctype, check, expect, msg } = test;
  const exp = ` - expected ${expect}, got ${check}`;
  const res = Is?.[ctype](check, expect);
  if (res === 1) func = Pass;
  return func(isNaN(res) ? `Unknown test, ${ctype}?` : msg + (!res ? exp : ''));
};

// read/include all tests
(async () => {
  let fail = 0;
  // read all test cases
  process.stdout.write('searching for test files...\n');
  const files = await fsp.readdir('./');
  for (const file of files.filter(file => file.startsWith(TestFilePrefix))) {
    process.stdout.write(`  importing -> ${file}\n`);
    Object.assign(TestCases, require('./' + file));
  }
  process.stdout.write('\n');
  // begin testing cases
  for (const [name, tests] of Object.entries(TestCases)) {
    process.stdout.write(`Testing ${name}:\n`);
    for (const test of tests) {
      const res = Test(test);
      if (res) {
        fail |= res;
        break;
      }
    }
  }
  // check results
  if (fail) process.stderr.write('\nSome tests failed... code: ' + fail);
  else process.stdout.write('\nAll tests passed ok!');
  process.stdout.write('\n');
  process.exit(fail);
})().catch(console.trace);
