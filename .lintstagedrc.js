const path = require('path');

const isJsFile = (filename) => /(.ts|.tsx|.js|.jsx)$/.test(filename);

const buildEslintCommand = (filenames) => {
  const jsFiles = filenames.filter(isJsFile);
  if (jsFiles.length === 0) {
    return 'echo "No js files"';
  }
  return `yarn lint --file ${jsFiles
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;
};

const buildJestCommand = (filenames) => {
  const jsFiles = filenames.filter(isJsFile);
  if (jsFiles.length === 0) {
    return 'echo "No js files"';
  }
  return `yarn test --findRelatedTests --bail ${jsFiles
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  './src/**/*': [
    'prettier --check ./src',
    buildEslintCommand,
    buildJestCommand,
  ],
};
