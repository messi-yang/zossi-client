const path = require('path');

const buildEslintCommand = (filenames) =>
  `yarn lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const buildJestCommand = (filenames) =>
  `yarn test --findRelatedTests --bail ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

module.exports = {
  './src/**/*.{js,jsx,ts,tsx}': [buildEslintCommand, buildJestCommand],
};
