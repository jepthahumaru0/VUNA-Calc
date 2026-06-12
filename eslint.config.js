const js = require('@eslint/js');

module.exports = [
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        // Browser globals
        window:          'readonly',
        document:        'readonly',
        console:         'readonly',
        localStorage:    'readonly',
        setTimeout:      'readonly',
        clearTimeout:    'readonly',
        setInterval:     'readonly',
        clearInterval:   'readonly',
        // Calculator globals (calculator.js exposes these for ui.js)
        evaluateExpression: 'readonly',
        percentOf:          'readonly',
        clearEntry:         'readonly',
        clearAll:           'readonly',
        currentExpression:  'writable',
        LAST_RESULT:        'writable',
        // Jest globals
        describe: 'readonly',
        it:       'readonly',
        expect:   'readonly',
        // Node/CommonJS
        module:  'writable',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'eqeqeq':         'error',
      'semi':           ['error', 'always'],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { console: 'readonly' },
    },
  },
];
