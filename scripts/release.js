const { execSync } = require('child_process');
const fs = require('node:fs');

const appName = 'KinoshkaTV';

const version = process.argv[2];
if (!version) {
  console.error('❌ Specify the version: npm run release vXX.XX.XX');
  process.exit(1);
}

const apkPath = 'android/app/build/outputs/apk/release/app-release.apk';
if (!fs.existsSync(apkPath)) {
  console.error(`❌ APK not found in path: ${apkPath}`);
  process.exit(1);
}

const releaseNotes =
  "Додаток надає можливість швидко знаходити, на публічних ресурсах, популярні відеофільми, мультфільми, кіношоу, серіали та інший відеоконтент у хорошій якості. Все відео в додатку програвається з відкритих ресурсів. Автори додатку не несуть відповідальності за данні ролики, ніяк не пов'язані з розміщенням та розповсюдженням відеоматеріалів.";

try {
  execSync(`git tag -a ${version} -m "Release ${version}"`, { stdio: 'inherit' });
  execSync(`git push origin ${version}`, { stdio: 'inherit' });

  execSync(
    `gh release create ${version} ${apkPath} --title "${appName} ${version}" --notes "${releaseNotes.replace(/\n/g, '\\n')}"`,
    { stdio: 'inherit' }
  );

  console.log(`✅ Release ${appName} ${version} created and APK uploaded!`);
} catch (err) {
  console.error('❌ Error creating release:', err.message);
  process.exit(1);
}
