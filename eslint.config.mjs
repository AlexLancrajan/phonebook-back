import globals from "globals";
import js from "@eslint/js";
import stylisticJS from '@stylistic/eslint-plugin-js'

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**"],
  },
  { 
    files: ["**/*.js"], 
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJS
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style' : [
        'error',
        'windows'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],     
      'no-console': 'off', 
    }
  },

];