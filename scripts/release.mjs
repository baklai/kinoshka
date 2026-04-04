import { execSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const config = require('../app.config.js');

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runSilent(cmd) {
  return execSync(cmd, { stdio: 'ignore' });
}

function isValidVersion(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

const appName = config?.expo?.name || 'KinoshkaTV';
const appVersion = config?.expo?.version;

const readmePath = join(__dirname, 'README.md');
const apkDir = join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'release');

const rawVersion = process.argv[2] || appVersion;

if (!rawVersion || !isValidVersion(rawVersion)) {
  console.error(
    '❌ Specify a valid version (X.X.X): npm run release X.X.X or set EXPO_PUBLIC_APP_VERSION in .env'
  );
  process.exit(1);
}

const version = `v${rawVersion}`;

try {
  runSilent('gh --version');
} catch {
  console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
  process.exit(1);
}

const originalApkPath = join(apkDir, 'app-release.apk');

if (!existsSync(originalApkPath)) {
  console.error(`❌ APK not found: ${originalApkPath}`);
  process.exit(1);
}

if (!existsSync(readmePath)) {
  console.error('❌ scripts/README.md not found');
  process.exit(1);
}

const customApkName = `${appName.toLowerCase()}-${version}.apk`;
const customApkPath = join(apkDir, customApkName);

copyFileSync(originalApkPath, customApkPath);
console.log(`📦 APK copied as ${customApkName}`);

try {
  runSilent(`gh release view ${version}`);

  console.log(`ℹ️  Release ${version} already exists, uploading new APK...`);
  run(`gh release upload ${version} "${customApkPath}" --clobber`);
  console.log(`✅ APK for ${appName} ${version} has been updated!`);
} catch {
  console.log(`ℹ️  Release ${version} not found, creating a new one...`);

  try {
    runSilent(`git rev-parse ${version}`);
    console.log(`ℹ️  Git tag ${version} already exists, skipping tag creation.`);
  } catch {
    run(`git tag -a ${version} -m "Release ${version}"`);
    run(`git push origin ${version}`);
  }

  run(
    `gh release create ${version} "${customApkPath}" --title "${appName} ${version}" --notes-file "${readmePath}"`
  );

  console.log(`✅ New release ${appName} ${version} created and APK uploaded!`);
}
