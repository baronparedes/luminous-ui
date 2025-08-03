const fs = require('fs');
const path = require('path');

// Read package.json (go up one directory since we're in scripts folder)
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Generate version file
const versionFileContent = `// Auto-generated file with version information
export const VERSION = '${packageJson.version}';
export const BUILD_DATE = '${new Date().toISOString()}';
`;

// Write version file (go up one directory, then into src)
const versionFilePath = path.join(__dirname, '..', 'src', 'version.ts');
fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`Version file updated: ${packageJson.version}`);
