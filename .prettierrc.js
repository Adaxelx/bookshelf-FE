module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.yml',
      options: { singleQuote: false },
    },
  ],
};
