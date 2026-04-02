const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runSilent(cmd) {
  return execSync(cmd, { stdio: 'ignore' });
}

function isValidVersion(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

const appConfigPath = path.join(__dirname, '..', 'app.json');
const readmePath = path.join(__dirname, 'README.md');
const apkDir = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'release');

const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf-8'));
const appName = appConfig?.expo?.name || 'KinoshkaTV';

const rawVersion = process.argv[2] || appConfig?.expo?.version;

if (!rawVersion || !isValidVersion(rawVersion)) {
  console.error('❌ Specify a valid version (X.X.X): npm run release X.X.X or set it in app.json');
  process.exit(1);
}

const version = `v${rawVersion}`;

try {
  runSilent('gh --version');
} catch {
  console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
  process.exit(1);
}

const originalApkPath = path.join(apkDir, 'app-release.apk');

if (!fs.existsSync(originalApkPath)) {
  console.error(`❌ APK not found: ${originalApkPath}`);
  process.exit(1);
}

if (!fs.existsSync(readmePath)) {
  console.error('❌ scripts/README.md not found');
  process.exit(1);
}

const customApkName = `${appName.toLowerCase()}-${version}.apk`;
const customApkPath = path.join(apkDir, customApkName);

fs.copyFileSync(originalApkPath, customApkPath);
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
