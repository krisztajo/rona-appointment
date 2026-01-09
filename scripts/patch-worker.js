const fs = require('fs');
const path = require('path');

const handlerPath = path.join(process.cwd(), '.open-next', 'server-functions', 'default', 'handler.mjs');

if (!fs.existsSync(handlerPath)) {
  console.log('.open-next/server-functions/default/handler.mjs not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(handlerPath, 'utf8');

// Pattern 1: globalThis.setImmediate=patchedSetImmediate
const pattern1 = /globalThis\.setImmediate\s*=\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
let count = 0;

content = content.replace(pattern1, (match, varName) => {
  count++;
  return `try{globalThis.setImmediate=${varName}}catch(e){}`;
});

// Pattern 2: nodeTimers.setImmediate=patchedSetImmediate
const pattern2 = /([a-zA-Z_$][a-zA-Z0-9_$]*)\.setImmediate\s*=\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
content = content.replace(pattern2, (match, obj, varName) => {
  // Only patch if obj is not 'this' or common safe objects
  if (obj === 'this' || obj === 'exports' || obj === 'module') return match;
  count++;
  return `try{${obj}.setImmediate=${varName}}catch(e){}`;
});

if (count > 0) {
  fs.writeFileSync(handlerPath, content, 'utf8');
  console.log(`Patched ${count} setImmediate assignments in handler.mjs to guard read-only errors.`);
} else {
  console.log('No setImmediate assignments found in handler.mjs.');
}
