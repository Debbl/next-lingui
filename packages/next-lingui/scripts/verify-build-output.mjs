import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(scriptDir, '..');
const distDir = join(packageDir, 'dist');

if (!existsSync(distDir)) {
  throw new Error(`Build output directory does not exist: ${distDir}`);
}

function listJsFiles(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...listJsFiles(fullPath));
      continue;
    }
    if (name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const forbiddenImportPattern = /['"]next\/(?:link|navigation|server)\.js['"]/g;
const offenders = [];

for (const filePath of listJsFiles(distDir)) {
  const code = readFileSync(filePath, 'utf8');
  if (forbiddenImportPattern.test(code)) {
    offenders.push(relative(packageDir, filePath));
  }
}

const useClientFiles = [
  'dist/navigation/shared/BaseLink.js',
  'dist/shared/NextLinguiClientProvider.js'
];
const missingUseClient = [];

for (const filePath of useClientFiles) {
  const absolutePath = join(packageDir, filePath);
  if (!existsSync(absolutePath)) {
    missingUseClient.push(`${filePath} (missing file)`);
    continue;
  }

  const code = readFileSync(absolutePath, 'utf8');
  if (!/['"]use client['"]\s*;/.test(code)) {
    missingUseClient.push(filePath);
  }
}

if (offenders.length > 0 || missingUseClient.length > 0) {
  if (offenders.length > 0) {
    console.error('Found forbidden next/*.js imports in:');
    for (const filePath of offenders) {
      console.error(`- ${filePath}`);
    }
  }

  if (missingUseClient.length > 0) {
    console.error("Missing preserved 'use client' directive in:");
    for (const filePath of missingUseClient) {
      console.error(`- ${filePath}`);
    }
  }

  process.exit(1);
}

console.log('Build output verification passed.');
