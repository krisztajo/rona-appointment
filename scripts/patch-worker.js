const fs = require('fs');
const path = require('path');

const workerPath = path.join(process.cwd(), '.open-next', 'worker.js');

if (!fs.existsSync(workerPath)) {
  console.log('.open-next/worker.js not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(workerPath, 'utf8');

const original = /globalThis\.setImmediate\s*=\s*setImmediate\s*;?/g;
const replacement = 'try{ if (typeof globalThis.setImmediate === "undefined") globalThis.setImmediate = setImmediate; }catch(e){}';

if (original.test(content)) {
  content = content.replace(original, replacement);
  fs.writeFileSync(workerPath, content, 'utf8');
  console.log('Patched .open-next/worker.js to guard setImmediate assignment.');
} else {
  console.log('No setImmediate assignment found in .open-next/worker.js.');
}
