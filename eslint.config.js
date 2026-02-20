import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        io: 'readonly',
        Module: 'readonly',
        Uint8Array: 'readonly',
        Uint8ClampedArray: 'readonly',
        ImageData: 'readonly',
        InstallTrigger: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'semi': ['error', 'always'],
      'eqeqeq': 'error',
      'no-eval': 'error'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'client/js/**',
      'src/rle.js'
    ]
  }
];
