import eslintJs from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import stylisticJs from '@stylistic/eslint-plugin-js';

// noinspection JSUnusedGlobalSymbols
export default [
  ...pluginVue.configs['flat/recommended'],
  {
    ...eslintJs.configs.recommended,
    files: [
      '**/*.cjs',
      '**/*.js',
      '**/*.mjs',
      '**/*.vue'
    ],
    ignores: [],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    linterOptions: {
      reportUnusedInlineConfigs: 'error'
    },
    plugins: {
      '@stylistic': stylisticJs,
      vue: pluginVue
    },
    rules: {
      '@stylistic/array-bracket-newline': [
        'error',
        {
          minItems: 3,
          multiline: true
        }
      ],
      '@stylistic/array-bracket-spacing': [
        'error',
        'never'
      ],
      '@stylistic/array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: {minItems: 3}
        }
      ],
      '@stylistic/arrow-spacing': ['error'],
      '@stylistic/brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true
        }
      ],
      '@stylistic/comma-dangle': [
        'error',
        'only-multiline'
      ],
      '@stylistic/comma-spacing': ['error'],
      '@stylistic/computed-property-spacing': ['error'],
      '@stylistic/block-spacing': [
        'error',
        'never'
      ],
      '@stylistic/function-call-spacing': ['error'],
      '@stylistic/key-spacing': ['error'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/max-len': [
        // enforce a maximum line length
        'error',
        220,
        4,
        {
          ignoreComments: false,
          ignoreTrailingComments: false,
          ignoreUrls: true,
          ignorePattern: '.*(SELECT .* FROM )|(INSERT INTO )|(UPDATE .* SET ).*'
        }
      ],
      '@stylistic/no-extra-semi': ['error'],
      '@stylistic/no-multi-spaces': ['error'],
      '@stylistic/no-tabs': ['error'],
      '@stylistic/quote-props': [
        // require quotes around object literal property names
        'error',
        'as-needed',
        {
          keywords: false,
          unnecessary: true,
          numbers: false
        }
      ],
      '@stylistic/quotes': [
        'error',
        'single',
        {avoidEscape: false}
      ],
      '@stylistic/semi': ['error'],
      '@stylistic/semi-spacing': [
        // enforce consistent spacing before and after semicolons [fixable]
        'error',
        {
          before: false,
          after: true
        }
      ],
      '@stylistic/semi-style': [
        // enforce location of semicolons
        'error',
        'last'
      ],
      '@stylistic/space-before-blocks': [
        // enforce consistent space before blocks [fixable]
        'error',
        {
          functions: 'always',
          keywords: 'always',
          classes: 'always'
        }
      ],
      '@stylistic/space-before-function-paren': [
        // enforce consistent spacing before `function` definition opening parenthesis [fixable]
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      '@stylistic/space-in-parens': [
        // enforce consistent spacing inside parentheses [fixable]
        'error',
        'never',
        {
          exceptions: []
        }
      ],
      '@stylistic/space-infix-ops': [
        // require spacing around operators [fixable]
        'error',
        {
          int32Hint: false
        }
      ],
      '@stylistic/space-unary-ops': [
        // enforce consistent spacing before or after unary operators [fixable]
        'error',
        {
          words: true,
          nonwords: false
        }
      ],
      '@stylistic/spaced-comment': [
        // enforce consistent spacing after the `//` or `/*` in a comment [fixable]
        'warn',
        'always'
      ],
      '@stylistic/switch-colon-spacing': [
        // enforce spacing around colons of switch statements
        'error',
        {
          after: true,
          before: false
        }
      ],
      '@stylistic/template-tag-spacing': [
        'error',
        'always'
      ],
      '@stylistic/wrap-regex': [
        // require parenthesis around regex literals
        'error'
      ],
      'id-length': [
        // enforce minimum and maximum identifier lengths
        'error',
        {
          min: 3,
          max: 60,
          properties: 'always',
          exceptions: [
            '_',
            'co',
            'el',
            'fs',
            'h',
            'id',
            'pg',
            's3',
            'to',
            'v1',
            'x',
            'y'
          ]
        }
      ],
      'id-match': [
        // require identifiers to match the provided regular expression
        'error',
        '^((([$A-Za-z]+)([A-Za-z0-9_-]+)*([A-Za-z0-9]))|[hxy_])$',
        {
          properties: false
        }
      ],
      'max-lines': [
        // enforce a maximum file length
        'error',
        3000
      ],
      'max-lines-per-function': [
        // enforce a maximum number of lines of code in a function
        'error',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true
        }
      ],
      'new-cap': [
        // require constructor `function` names to begin with a capital letter
        'error',
        {
          newIsCap: true,
          capIsNew: true,
          newIsCapExceptions: [],
          capIsNewExceptions: [
            'Array',
            'Boolean',
            'Date',
            'Error',
            'Function',
            'Number',
            'Object',
            'RegExp',
            'String',
            'Symbol'
          ],
          properties: true
        }
      ],
      'no-bitwise': [
        // disallow bitwise operators
        'error',
        {
          allow: [],
          int32Hint: false
        }
      ],
      'no-constant-condition': [
        'error',
        {
          checkLoops: 'all'
        }
      ],
      'no-console': ['error'],
      'no-duplicate-imports': ['error'],
      'no-invalid-this': [
        // disallow `this` keywords outside classes or class-like objects
        'error'
      ],
      'no-shadow': ['error'],
      'no-undef': ['error'],
      'no-underscore-dangle': [
        // disallow dangling underscores in identifiers
        'error',
        {
          allow: [],
          allowAfterThis: false
        }
      ],
      'no-unexpected-multiline': ['error'],
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '^ignore',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^ignore',
          ignoreRestSiblings: false
        }
      ],
      'prefer-const': ['error'],
      'require-atomic-updates': [
        // disallow assignments that can lead to race conditions due to usage of `await` or `yield`
        'off'
      ],
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: [
            'none',
            'all',
            'single',
            'multiple'
          ],
          allowSeparatedGroups: false
        }
      ],
      'sort-keys': [
        'off',
        'asc',
        {
          caseSensitive: false,
          minKeys: 2,
          natural: true,
          allowLineSeparatedGroups: false
        }
      ],
      'sort-vars': [
        'warn',
        {
          ignoreCase: true
        }
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/no-required-prop-with-default': ['off']
    }
  }
];
