// module.exports = {
//   extends: [
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:react/jsx-runtime',
//     '@electron-toolkit',
//     '@electron-toolkit/eslint-config-prettier'
//   ],
//   rules: {
//     'linebreak-style' : ['off']
//   }
// }

module.exports = {
  parser: '@babel/eslint-parser',  // Set the parser to babel-eslint
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,  // Allows ESLint to understand ECMAScript 2020 syntax
    sourceType: 'module',  // Allows for the use of `import/export`
    ecmaFeatures: {
      jsx: true  // Allow JSX syntax
    }
  },
  rules: {
    'linebreak-style': 'off',
  },
  settings: {
    react: {
      version: 'detect',  // Automatically detect React version
    }
  }
};

