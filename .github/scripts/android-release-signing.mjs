// Run after `expo prebuild`: makes the release build sign with the upload keystore
// from ANDROID_KEYSTORE_* env vars instead of Expo's default debug key.
// Patching the generated file keeps app.json and your EAS setup untouched.
import fs from 'node:fs';

const file = process.argv[2] ?? 'android/app/build.gradle';
let gradle = fs.readFileSync(file, 'utf8');

if (!gradle.includes('ANDROID_KEYSTORE_PATH')) {
  gradle = gradle.replace(
    /signingConfigs\s*\{/,
    `signingConfigs {
        release {
            storeFile file(System.getenv('ANDROID_KEYSTORE_PATH'))
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
            keyAlias System.getenv('ANDROID_KEY_ALIAS')
            keyPassword System.getenv('ANDROID_KEY_PASSWORD')
        }`,
  );
  const before = gradle;
  gradle = gradle.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
    '$1signingConfig signingConfigs.release',
  );
  if (gradle === before) throw new Error(`Could not find the release signingConfig in ${file}`);
  fs.writeFileSync(file, gradle);
}
console.log(`Release signing configured in ${file}`);
