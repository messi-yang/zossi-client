const path = require('path');

const isJsFile = (filename) => /(.ts|.tsx|.js|.jsx)$/.test(filename);

const buildPrettierCommand = (filenames) => {
  return `prettier --check ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;
};

const buildEslintCommand = (filenames) => {
  const jsFiles = filenames.filter(isJsFile);
  if (jsFiles.length === 0) {
    return 'echo "No js files"';
  }
  return `yarn lint --file ${jsFiles.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;
};

const buildTypeCommand = () => {
  return 'yarn type';
};

const buildJestCommand = (filenames) => {
  const jsFiles = filenames.filter(isJsFile);
  if (jsFiles.length === 0) {
    return 'echo "No js files"';
  }
  return `yarn test --findRelatedTests --passWithNoTests --bail ${jsFiles
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  './src/**/*': [buildPrettierCommand, buildEslintCommand, buildTypeCommand, buildJestCommand],
};
