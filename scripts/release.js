const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appConfigJSON = fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf-8');

const appConfig = JSON.parse(appConfigJSON);

const appName = appConfig?.expo?.name || 'KinoshkaTV';
const version = process?.argv?.[2]
  ? `v${process.argv[2]}`
  : appConfig?.expo?.version
    ? `v${appConfig.expo.version}`
    : null;

if (!version) {
  console.error('❌ Specify the version: npm run release XX.XX.XX or write it in app.json');
  process.exit(1);
}

const apkPath = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk'
);

if (!fs.existsSync(apkPath)) {
  console.error(`❌ APK not found in path: ${apkPath}`);
  process.exit(1);
}

let releaseNotes = '';

try {
  releaseNotes = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8');
} catch (err) {
  console.warn('⚠️ README.md not found!');
  process.exit(1);
}

try {
  execSync(`git tag -a ${version} -m "Release ${version}"`, { stdio: 'inherit' });
  execSync(`git push origin ${version}`, { stdio: 'inherit' });

  execSync(
    `gh release create ${version} ${apkPath} --title "${appName} ${version}" --notes "${releaseNotes}"`,
    { stdio: 'inherit' }
  );

  console.log(`✅ Release ${appName} ${version} created and APK uploaded!`);
} catch (err) {
  console.error('❌ Error creating release:', err.message);
  process.exit(1);
}
