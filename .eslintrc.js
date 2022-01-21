module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'simple-import-sort'],
  ignorePatterns: ['remix.config.js', '.eslintrc.js', '.prettierrc.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    curly: 'error',
    'import/no-anonymous-default-export': 'off',
    'no-unused-vars': ['error', { args: 'after-used' }],
    '@typescript-eslint/explicit-function-return-type': 0,
    'simple-import-sort/imports': [
      1, // as warning for now
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          // Absolute imports and other imports such as `@/foo`.
          // Anything that does not start with a dot.
          [
            '^(api)(/.*|$)',
            '^(constants)(/.*|$)',
            '^(helpers)(/.*|$)',
            '^(hooks)(/.*|$)',
            '^(types)(/.*|$)',
            '^(styles)(/.*|$)',
            '^(assets)(/.*|$)',
            '^(features)(/.*|$)',
            '^(views)(/.*|$)',
            '^(containers)(/.*|$)',
            '^(components)(/.*|$)',
            '^(translations)(/.*|$)',
            '^(mocks)(/.*|$)',
            '^[^.]',
          ],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        // disables the base rule as it can report incorrect errors
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
};
