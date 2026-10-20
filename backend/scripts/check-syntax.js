const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const sourceDirectory = path.resolve(__dirname, '..', 'src');
const javascriptFiles = [];

function collectJavaScriptFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectJavaScriptFiles(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      javascriptFiles.push(entryPath);
    }
  }
}

collectJavaScriptFiles(sourceDirectory);

for (const filePath of javascriptFiles) {
  const result = spawnSync(process.execPath, ['--check', filePath], {
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`JavaScript syntax check passed for ${javascriptFiles.length} files.`);
